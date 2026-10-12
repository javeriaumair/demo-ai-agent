import { z } from "zod";
import { articleRequestSchema, type GenerateResponse } from "@/lib/article-schema";
import { generateArticle, UserFacingError } from "@/lib/ai";
import { reserveGeneration } from "@/lib/rate-limit";

// Long articles can take a while on the free tier.
export const maxDuration = 120;

const MAX_BODY_BYTES = 10_000;

function json(body: GenerateResponse, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

function clientKey(request: Request): string {
  // On Vercel, x-forwarded-for is set by the platform (first entry = client).
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

/** Block cross-site browser requests so other websites can't use our AI quota. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients; still rate-limited
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, error: "Request not allowed." }, 403);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Expected a JSON request." }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid JSON." }, 400);
  }

  const parsed = articleRequestSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const field = first?.path.join(".");
    return json(
      { ok: false, error: first ? `${field ? `${field}: ` : ""}${first.message}` : z.prettifyError(parsed.error) },
      400,
    );
  }

  const quota = await reserveGeneration(clientKey(request));
  if (!quota.allowed) {
    return json(
      { ok: false, error: "You have used all your free articles for today. Please come back tomorrow!" },
      429,
    );
  }

  try {
    const result = await generateArticle(parsed.data);
    return json({ ok: true, result, remaining: quota.remaining }, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    await quota.release(); // failed generations don't count against the limit
    if (error instanceof UserFacingError) {
      return json({ ok: false, error: error.message }, error.status);
    }
    console.error("[api/generate] unexpected error", error);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
}
