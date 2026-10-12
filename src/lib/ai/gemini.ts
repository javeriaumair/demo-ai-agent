import "server-only";
import { ApiError, GoogleGenAI } from "@google/genai";
import { z } from "zod";
import {
  articleResultSchema,
  type ArticleRequest,
  type ArticleResult,
} from "@/lib/article-schema";
import { SYSTEM_INSTRUCTION, buildUserPrompt } from "./prompts";
import { UserFacingError } from "./errors";

const DEFAULT_MODEL = "gemini-3.8-flash";
const TIMEOUT_MS = 110_000;

// Gemini accepts a JSON Schema subset; drop the "$schema" meta key.
const responseJsonSchema = z.toJSONSchema(articleResultSchema);
delete responseJsonSchema.$schema;

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new UserFacingError(
      "The AI is not set up yet: GEMINI_API_KEY is missing in .env.local. Add your key and restart the server.",
      500,
    );
  }
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

export async function generateWithGemini(input: ArticleRequest): Promise<ArticleResult> {
  const ai = getClient();

  let text: string | undefined;
  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL,
      contents: buildUserPrompt(input),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseJsonSchema,
        temperature: 0.7,
        abortSignal: AbortSignal.timeout(TIMEOUT_MS),
      },
    });
    text = response.text;
  } catch (error) {
    throw toUserFacingError(error);
  }

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
        "The Gemini API key is not valid. Check GEMINI_API_KEY in .env.local.",
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
        "The configured Gemini model was not found. Check GEMINI_MODEL in .env.local.",
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
