"use client";

import { useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import {
  CircleQuestionMark,
  Download,
  Eye,
  FileText,
  ListTree,
  LoaderCircle,
  PenLine,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { ArticleResult } from "@/lib/article-schema";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  downloadBlob,
  faqToMarkdown,
  fileNameFrom,
  outlineToMarkdown,
  toMarkdown,
} from "@/lib/export/markdown";
import { fieldClass, labelClass } from "@/lib/ui";

const META_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 160;

type ArticleResultViewProps = {
  result: ArticleResult;
  onChange: (result: ArticleResult) => void;
  keyword: string;
  rtl: boolean;
  remaining: number;
};

// Markdown renderer styles (no raw HTML is rendered — safe against XSS).
const markdownComponents: Components = {
  h1: ({ children }) => <h1 className="mb-4 text-3xl font-bold tracking-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-8 mb-3 text-2xl font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 text-xl font-semibold">{children}</h3>,
  p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 ps-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 ps-6">{children}</ol>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-s-4 border-accent/50 ps-4 text-muted">{children}</blockquote>
  ),
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="text-accent underline">
      {children}
    </a>
  ),
};

function Card({
  icon: Icon,
  title,
  actions,
  children,
}: {
  icon: LucideIcon;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-brand border border-line bg-surface p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold">
          <span className="grid size-9 place-items-center rounded-[11px] bg-accent/10 text-accent">
            <Icon className="size-5" aria-hidden />
          </span>
          {title}
        </h2>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-xs ${over ? "font-semibold text-red-500" : "text-muted"}`}>
      {value.length}/{max}
    </span>
  );
}

export function ArticleResultView({ result, onChange, keyword, rtl, remaining }: ArticleResultViewProps) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [docxState, setDocxState] = useState<"idle" | "working" | "failed">("idle");

  const dir = rtl ? "rtl" : "ltr";
  const contentFont = rtl ? "font-urdu leading-[2.2]" : "";
  const baseName = fileNameFrom(keyword);
  const update = (patch: Partial<ArticleResult>) => onChange({ ...result, ...patch });

  function downloadMarkdown() {
    downloadBlob(new Blob([toMarkdown(result)], { type: "text/markdown;charset=utf-8" }), `${baseName}.md`);
  }

  async function downloadDocx() {
    setDocxState("working");
    try {
      const { buildDocx } = await import("@/lib/export/docx");
      downloadBlob(await buildDocx(result, rtl), `${baseName}.docx`);
      setDocxState("idle");
    } catch (error) {
      console.error("docx export failed", error);
      setDocxState("failed");
    }
  }

  const secondaryButton =
    "inline-flex items-center gap-1.5 rounded-brand border border-line bg-surface px-3 py-2 text-sm font-medium transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 disabled:opacity-60";

  return (
    <div className="grid gap-5">
      {/* toolbar */}
      <div className="flex flex-col gap-3 rounded-brand border border-accent/30 bg-accent/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          <span className="font-semibold">Your article is ready!</span>{" "}
          <span className="text-muted">
            {remaining} {remaining === 1 ? "article" : "articles"} left today · not saved — copy or download it.
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={() => toMarkdown(result)} label="Copy all" />
          <button type="button" onClick={downloadMarkdown} className={secondaryButton}>
            <Download className="size-4" aria-hidden />
            .md
          </button>
          <button type="button" onClick={downloadDocx} disabled={docxState === "working"} className={secondaryButton}>
            {docxState === "working" ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            ) : (
              <Download className="size-4" aria-hidden />
            )}
            .docx
          </button>
        </div>
      </div>
      {docxState === "failed" && (
        <p role="alert" className="text-sm text-red-500">
          Could not create the .docx file. Please try again or use .md.
        </p>
      )}

      <Card icon={Search} title="SEO meta tags">
        <div className="grid gap-5" dir={dir}>
          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="metaTitle" className={labelClass}>
                Meta title
              </label>
              <CharCount value={result.metaTitle} max={META_TITLE_MAX} />
            </div>
            <div className="flex gap-2">
              <input
                id="metaTitle"
                value={result.metaTitle}
                onChange={(e) => update({ metaTitle: e.target.value })}
                className={`${fieldClass} ${contentFont}`}
              />
              <CopyButton text={result.metaTitle} label="Copy" className="shrink-0" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="metaDescription" className={labelClass}>
                Meta description
              </label>
              <CharCount value={result.metaDescription} max={META_DESCRIPTION_MAX} />
            </div>
            <div className="flex gap-2">
              <textarea
                id="metaDescription"
                rows={3}
                value={result.metaDescription}
                onChange={(e) => update({ metaDescription: e.target.value })}
                className={`${fieldClass} resize-y ${contentFont}`}
              />
              <CopyButton text={result.metaDescription} label="Copy" className="shrink-0 self-start" />
            </div>
          </div>
        </div>
      </Card>

      <Card icon={ListTree} title="Outline" actions={<CopyButton text={() => outlineToMarkdown(result.outline)} />}>
        <ol dir={dir} className={`grid list-decimal gap-2 ps-6 ${contentFont}`}>
          {result.outline.map((section, i) => (
            <li key={i} className="font-semibold">
              {section.heading}
              {section.subheadings.length > 0 && (
                <ul className="mt-1 list-disc space-y-1 ps-5 font-normal text-muted">
                  {section.subheadings.map((sub, j) => (
                    <li key={j}>{sub}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </Card>

      <Card
        icon={FileText}
        title="Article"
        actions={
          <>
            <div className="inline-flex rounded-brand border border-line p-1" role="group" aria-label="Article view">
              {(
                [
                  { value: "preview", label: "Preview", icon: Eye },
                  { value: "edit", label: "Edit", icon: PenLine },
                ] as const
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={`inline-flex items-center gap-1.5 rounded-[11px] px-3 py-1.5 text-sm font-medium transition ${mode === value ? "bg-accent text-white" : "text-muted hover:text-foreground"}`}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
            <CopyButton text={result.article} />
          </>
        }
      >
        {mode === "edit" ? (
          <div>
            <label htmlFor="articleEditor" className="sr-only">
              Edit article (Markdown)
            </label>
            <textarea
              id="articleEditor"
              dir={dir}
              value={result.article}
              onChange={(e) => update({ article: e.target.value })}
              rows={24}
              className={`${fieldClass} min-h-96 resize-y font-mono text-sm leading-relaxed ${rtl ? "font-urdu" : ""}`}
            />
            <p className="mt-2 text-xs text-muted">
              Markdown: <code>#</code> heading, <code>##</code> section, <code>**bold**</code>, <code>-</code> list.
            </p>
          </div>
        ) : (
          <article dir={dir} className={`text-foreground ${contentFont}`}>
            <ReactMarkdown components={markdownComponents}>{result.article}</ReactMarkdown>
          </article>
        )}
      </Card>

      <Card icon={CircleQuestionMark} title="FAQ" actions={<CopyButton text={() => faqToMarkdown(result.faq)} />}>
        <dl dir={dir} className={`grid gap-4 ${contentFont}`}>
          {result.faq.map((item, i) => (
            <div key={i} className="rounded-brand bg-surface-2 p-4">
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-1.5 text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
