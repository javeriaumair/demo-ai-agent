// Zod schemas shared by the browser (form checks) and the server (API
// validation). The server ALWAYS re-validates — never trust the client.
import { z } from "zod";
import { LANGUAGES, LENGTHS, MAX_LENGTHS, TONES } from "./article-options";

const values = <T extends ReadonlyArray<{ value: string }>>(list: T) =>
  list.map((item) => item.value) as [T[number]["value"], ...T[number]["value"][]];

// Strip control characters and collapse whitespace in free-text fields.
const cleanText = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim())
    .pipe(z.string().max(max, `Must be at most ${max} characters.`));

export const articleRequestSchema = z.object({
  keyword: cleanText(MAX_LENGTHS.keyword).pipe(
    z.string().min(2, "Please enter a topic or keyword (at least 2 characters)."),
  ),
  extraKeywords: cleanText(MAX_LENGTHS.extraKeywords).default(""),
  tone: z.enum(values(TONES)),
  length: z.enum(values(LENGTHS)),
  audience: cleanText(MAX_LENGTHS.audience).default(""),
  language: z.enum(values(LANGUAGES)),
});

export type ArticleRequest = z.infer<typeof articleRequestSchema>;

// Shape we ask Gemini to return (also used to validate its JSON).
export const articleResultSchema = z.object({
  metaTitle: z.string().min(1).describe("SEO meta title, max 60 characters, includes the main keyword"),
  metaDescription: z
    .string()
    .min(1)
    .describe("SEO meta description, max 160 characters, includes the main keyword"),
  outline: z
    .array(
      z.object({
        heading: z.string().min(1).describe("H2 section heading"),
        subheadings: z.array(z.string()).describe("H3 subheadings under this H2 (can be empty)"),
      }),
    )
    .min(1)
    .describe("Article outline: the H2 sections in order"),
  article: z
    .string()
    .min(1)
    .describe("The full article in Markdown, starting with a single '# ' H1 title, following the outline"),
  faq: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .length(5)
    .describe("Exactly 5 frequently asked questions with concise answers"),
});

export type ArticleResult = z.infer<typeof articleResultSchema>;

export type GenerateResponse =
  | { ok: true; result: ArticleResult; remaining: number }
  | { ok: false; error: string };
