import "server-only";
import { ApiError, GoogleGenAI, ThinkingLevel, type GenerateContentConfig } from "@google/genai";
import { z } from "zod";
import {
  articleResultSchema,
  type ArticleRequest,
  type ArticleResult,
} from "@/lib/article-schema";
import { SYSTEM_INSTRUCTION, buildUserPrompt } from "./prompts";
import { UserFacingError } from "./errors";

// Tried in order: if a model is overloaded, rate-limited or too slow, the
// next one is used. Override with GEMINI_MODEL (comma-separated list).
// gemini-3.8-flash is newest but was very slow under free-tier demand
// (Oct 2026), so it is not the default.
const DEFAULT_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite"];

// Models that accept a thinking level; LOW keeps answers fast.
const LOW_THINKING_MODELS = new Set(["gemini-3.8-flash", "gemini-3.6-flash"]);

const TOTAL_BUDGET_MS = 110_000; // stays under the route's maxDuration
const PER_ATTEMPT_MS = 60_000; // leave time for a fallback model

function configuredModels(): string[] {
  const fromEnv = process.env.GEMINI_MODEL?.split(",").map((m) => m.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_MODELS;
}

// Gemini accepts a JSON Schema subset; drop the "$schema" meta key.
const responseJsonSchema = z.toJSONSchema(articleResultSchema);
delete responseJsonSchema.$schema;

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new UserFacingError(
      "The AI is not set up yet: GEMINI_API_KEY is missing. Add it to .env.local (local) or Vercel Environment Variables, then restart/redeploy.",
      500,
    );
  }
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

/** Errors where trying another model may help. */
function isRetryable(error: unknown): boolean {
  if (error instanceof ApiError) return [429, 500, 503, 504].includes(error.status);
  return error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
}

export async function generateWithGemini(input: ArticleRequest): Promise<ArticleResult> {
  const ai = getClient();
  const models = configuredModels();
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  let text: string | undefined;
  let lastError: unknown;
  for (const [i, model] of models.entries()) {
    const isLast = i === models.length - 1;
    const remaining = deadline - Date.now();
    if (remaining < 5_000) break;

    const config: GenerateContentConfig = {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseJsonSchema,
      temperature: 0.7,
      abortSignal: AbortSignal.timeout(isLast ? remaining : Math.min(PER_ATTEMPT_MS, remaining)),
    };
    if (LOW_THINKING_MODELS.has(model)) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
    }

    try {
      const started = Date.now();
      const response = await ai.models.generateContent({ model, contents: buildUserPrompt(input), config });
      console.info(`[gemini] ${model} answered in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      text = response.text;
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || isLast) break;
      console.warn(`[gemini] ${model} failed (${error instanceof ApiError ? error.status : (error as Error).name}), trying next model`);
    }
  }
  if (lastError) throw toUserFacingError(lastError);

  if (!text) {
    throw new UserFacingError(
      "The AI returned an empty answer (it may have been blocked by safety filters). Try rephrasing your topic.",
      502,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new UserFacingError("The AI returned an unexpected format. Please try again.", 502);
  }

  const result = articleResultSchema.safeParse(parsed);
  if (!result.success) {
    console.error("[gemini] invalid result shape", z.prettifyError(result.error));
    throw new UserFacingError("The AI returned an incomplete article. Please try again.", 502);
  }
  return result.data;
}

function toUserFacingError(error: unknown): UserFacingError {
  if (error instanceof UserFacingError) return error;

  if (error instanceof ApiError) {
    console.error(`[gemini] API error ${error.status}: ${error.message}`);
    if (error.status === 429) {
      return new UserFacingError(
        "The free AI quota is used up for now. Please wait a minute and try again.",
        503,
      );
    }
    if (error.status === 400 && /api key/i.test(error.message)) {
      return new UserFacingError(
        "The Gemini API key is not valid. Check GEMINI_API_KEY (.env.local or Vercel Environment Variables).",
        500,
      );
    }
    if (error.status === 403) {
      return new UserFacingError(
        "The Gemini API key does not have access. Check the key in Google AI Studio.",
        500,
      );
    }
    if (error.status === 404) {
      return new UserFacingError(
        "The configured Gemini model was not found. Check the GEMINI_MODEL setting.",
        500,
      );
    }
    if (error.status >= 500) {
      return new UserFacingError("The AI service is busy right now. Please try again shortly.", 503);
    }
  }

  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
    return new UserFacingError(
      "The AI took too long to answer. Try a shorter article length or try again.",
      504,
    );
  }

  console.error("[gemini] unexpected error", error);
  return new UserFacingError("Something went wrong while writing the article. Please try again.", 500);
}
