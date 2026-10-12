// Shared option lists for the article form. Kept in one place so the UI and
// (later) server-side validation use exactly the same values.

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ur", label: "Urdu" },
  { value: "roman-ur", label: "Roman Urdu" },
] as const;

export const TONES = [
  { value: "professional", label: "Professional" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
] as const;

export const LENGTHS = [
  { value: "short", label: "Short (~600 words)" },
  { value: "medium", label: "Medium (~1200 words)" },
  { value: "long", label: "Long (~2000 words)" },
] as const;

export type Language = (typeof LANGUAGES)[number]["value"];
export type Tone = (typeof TONES)[number]["value"];
export type ArticleLength = (typeof LENGTHS)[number]["value"];

export const DEFAULTS = {
  language: "en",
  tone: "professional",
  length: "medium",
} as const satisfies {
  language: Language;
  tone: Tone;
  length: ArticleLength;
};

export const MAX_LENGTHS = {
  keyword: 100,
  extraKeywords: 300,
  audience: 150,
} as const;
