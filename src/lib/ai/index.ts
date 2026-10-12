import "server-only";
import type { ArticleRequest, ArticleResult } from "@/lib/article-schema";
import { generateWithGemini } from "./gemini";

// Single entry point for article generation. To add a provider (e.g. Groq
// fallback in 1A, or a paid model in Phase 3), branch here — callers stay
// the same.
export async function generateArticle(input: ArticleRequest): Promise<ArticleResult> {
  return generateWithGemini(input);
}

export { UserFacingError } from "./errors";
