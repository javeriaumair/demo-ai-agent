"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CircleAlert, LoaderCircle, Sparkles } from "lucide-react";
import {
  DEFAULTS,
  LANGUAGES,
  LENGTHS,
  MAX_LENGTHS,
  TONES,
} from "@/lib/article-options";
import {
  articleRequestSchema,
  type ArticleRequest,
  type ArticleResult,
  type GenerateResponse,
} from "@/lib/article-schema";
import { ArticleResultView } from "@/components/dashboard/ArticleResultView";
import {
  fieldClass,
  hintClass,
  labelClass,
  primaryButtonClass,
} from "@/lib/ui";

const CLIENT_TIMEOUT_MS = 130_000;

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; request: ArticleRequest; result: ArticleResult; remaining: number };

export function ArticleForm() {
  const [state, setState] = useState<State>({ status: "idle" });
  const resultRef = useRef<HTMLDivElement>(null);
  const loading = state.status === "loading";

  // Bring the status / result into view when it appears.
  useEffect(() => {
    if (state.status !== "idle") {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state.status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const parsed = articleRequestSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setState({ status: "error", message: parsed.error.issues[0]?.message ?? "Please check the form." });
      return;
    }

    setState({ status: "loading" });
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
      });
      const data = (await response.json().catch(() => null)) as GenerateResponse | null;

      if (!data) {
        setState({ status: "error", message: `Server error (${response.status}). Please try again.` });
      } else if (!data.ok) {
        setState({ status: "error", message: data.error });
      } else {
        setState({ status: "success", request: parsed.data, result: data.result, remaining: data.remaining });
      }
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "TimeoutError";
      setState({
        status: "error",
        message: timedOut
          ? "This is taking too long. Please try again, maybe with a shorter length."
          : "Could not reach the server. Check your internet connection and try again.",
      });
    }
  }

  return (
    <div className="grid gap-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-brand border border-line bg-surface p-5 shadow-sm sm:p-8"
      >
        <fieldset disabled={loading} className="grid gap-6">
          <div>
            <label htmlFor="keyword" className={labelClass}>
              Topic / main keyword <span className="text-accent">*</span>
            </label>
            <input
              id="keyword"
              name="keyword"
              type="text"
              required
              minLength={2}
              maxLength={MAX_LENGTHS.keyword}
              placeholder="e.g. Best summer lawn suits 2026"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="extraKeywords" className={labelClass}>
              Extra keywords
            </label>
            <input
              id="extraKeywords"
              name="extraKeywords"
              type="text"
              maxLength={MAX_LENGTHS.extraKeywords}
              placeholder="e.g. lawn collection, summer dresses, Pakistan"
              className={fieldClass}
            />
            <p className={hintClass}>Separate keywords with commas.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="tone" className={labelClass}>
                Tone
              </label>
              <select id="tone" name="tone" defaultValue={DEFAULTS.tone} className={fieldClass}>
                {TONES.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="length" className={labelClass}>
                Article length
              </label>
              <select id="length" name="length" defaultValue={DEFAULTS.length} className={fieldClass}>
                {LENGTHS.map((length) => (
                  <option key={length.value} value={length.value}>
                    {length.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="audience" className={labelClass}>
              Target audience
            </label>
            <input
              id="audience"
              name="audience"
              type="text"
              maxLength={MAX_LENGTHS.audience}
              placeholder="e.g. Small shop owners in Pakistan"
              className={fieldClass}
            />
          </div>

          <fieldset>
            <legend className={labelClass}>Language</legend>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((language) => (
                <label key={language.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={language.value}
                    defaultChecked={language.value === DEFAULTS.language}
                    className="peer sr-only"
                  />
                  <span className="flex h-full items-center justify-center rounded-brand border border-line px-2 py-3 text-center text-sm font-medium text-muted transition peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:ring-4 peer-focus-visible:ring-accent/15 hover:border-accent/50">
                    {language.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className={`${primaryButtonClass} w-full py-4 disabled:cursor-wait disabled:opacity-70`}
          >
            {loading ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-5" aria-hidden />
            )}
            {loading ? "Writing..." : "Generate Article"}
          </button>

          <p className="text-center text-xs text-muted">
            Free AI (Google Gemini) is used — please don&apos;t enter private or confidential information.
          </p>
        </fieldset>
      </form>

      <div ref={resultRef} className="scroll-mt-24" aria-live="polite">
        {state.status === "loading" && (
          <div className="flex flex-col items-center gap-4 rounded-brand border border-line bg-surface px-6 py-12 text-center">
            <span className="relative grid size-16 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-fuchsia-500/20" />
              <span className="grid size-16 place-items-center rounded-full bg-brand-gradient shadow-lg shadow-fuchsia-500/30">
                <Sparkles className="size-7 text-white" aria-hidden />
              </span>
            </span>
            <p className="text-lg font-semibold">Article likha ja raha hai...</p>
            <p className="max-w-sm text-sm text-muted">
              Outline, article, meta tags and FAQ are being written. This can take 20–60 seconds.
            </p>
          </div>
        )}

        {state.status === "error" && (
          <div role="alert" className="flex items-start gap-3 rounded-brand border border-red-500/30 bg-red-500/10 p-4 text-red-700 dark:text-red-300">
            <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Article could not be generated</p>
              <p className="mt-1 text-sm">{state.message}</p>
            </div>
          </div>
        )}

        {state.status === "success" && (
          <ArticleResultView
            result={state.result}
            onChange={(result) => setState({ ...state, result })}
            keyword={state.request.keyword}
            rtl={state.request.language === "ur"}
            remaining={state.remaining}
          />
        )}
      </div>
    </div>
  );
}
