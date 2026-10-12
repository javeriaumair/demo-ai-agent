import type { ArticleResult } from "@/lib/article-schema";

export function outlineToMarkdown(outline: ArticleResult["outline"]): string {
  return outline
    .map((section) =>
      [`- ${section.heading}`, ...section.subheadings.map((sub) => `  - ${sub}`)].join("\n"),
    )
    .join("\n");
}

export function faqToMarkdown(faq: ArticleResult["faq"]): string {
  return faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n");
}

/** Full content package as one Markdown document (used for Copy all and .md download). */
export function toMarkdown(result: ArticleResult): string {
  return [
    `**Meta title:** ${result.metaTitle}`,
    `**Meta description:** ${result.metaDescription}`,
    "---",
    result.article.trim(),
    "## FAQ",
    faqToMarkdown(result.faq),
  ].join("\n\n");
}

/** Safe file name from the keyword, e.g. "Best Lawn 2026!" -> "best-lawn-2026". */
export function fileNameFrom(keyword: string): string {
  const slug = keyword
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "likhoai-article";
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
