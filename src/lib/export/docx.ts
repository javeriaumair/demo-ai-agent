// Builds a .docx in the browser from the article's Markdown. The `docx`
// library is loaded only when the user clicks the download button.
import type { ArticleResult } from "@/lib/article-schema";

type Docx = typeof import("docx");

/** Split "**bold** text" into runs. */
function inlineRuns(docx: Docx, text: string, rtl: boolean) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      const bold = part.startsWith("**") && part.endsWith("**");
      const clean = (bold ? part.slice(2, -2) : part).replace(/(^|[^*])\*([^*]+)\*/g, "$1$2");
      return new docx.TextRun({ text: clean, bold, rightToLeft: rtl });
    });
}

function markdownToParagraphs(docx: Docx, markdown: string, rtl: boolean) {
  const { HeadingLevel, Paragraph } = docx;
  const paragraphs: InstanceType<Docx["Paragraph"]>[] = [];
  const headings = {
    1: HeadingLevel.TITLE,
    2: HeadingLevel.HEADING_1,
    3: HeadingLevel.HEADING_2,
    4: HeadingLevel.HEADING_3,
  } as const;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line === "---") continue;

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length as 1 | 2 | 3 | 4;
      paragraphs.push(
        new Paragraph({
          heading: headings[level],
          bidirectional: rtl,
          children: inlineRuns(docx, heading[2], rtl),
        }),
      );
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      paragraphs.push(
        new Paragraph({
          bullet: { level: rawLine.startsWith("  ") ? 1 : 0 },
          bidirectional: rtl,
          children: inlineRuns(docx, (bullet ?? numbered)![1], rtl),
        }),
      );
      continue;
    }

    paragraphs.push(
      new Paragraph({
        bidirectional: rtl,
        spacing: { after: 160 },
        children: inlineRuns(docx, line.replace(/^>\s?/, ""), rtl),
      }),
    );
  }
  return paragraphs;
}

export async function buildDocx(result: ArticleResult, rtl: boolean): Promise<Blob> {
  const docx = await import("docx");
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;

  const metaLine = (label: string, value: string) =>
    new Paragraph({
      bidirectional: rtl,
      children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun({ text: value, rightToLeft: rtl })],
    });

  const faq = result.faq.flatMap((item) => [
    new Paragraph({ heading: HeadingLevel.HEADING_2, bidirectional: rtl, children: inlineRuns(docx, item.question, rtl) }),
    new Paragraph({ bidirectional: rtl, spacing: { after: 160 }, children: inlineRuns(docx, item.answer, rtl) }),
  ]);

  const doc = new Document({
    creator: "LikhoAI",
    title: result.metaTitle,
    description: result.metaDescription,
    sections: [
      {
        children: [
          metaLine("Meta title", result.metaTitle),
          metaLine("Meta description", result.metaDescription),
          new Paragraph({ text: "" }),
          ...markdownToParagraphs(docx, result.article, rtl),
          new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: rtl, children: [new TextRun({ text: "FAQ", rightToLeft: rtl })] }),
          ...faq,
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
}
