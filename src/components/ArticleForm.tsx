"use client";

import { useState, type FormEvent } from "react";
import {
  DEFAULTS,
  LANGUAGES,
  LENGTHS,
  MAX_LENGTHS,
  TONES,
} from "@/lib/article-options";

const fieldClass =
  "w-full rounded-brand border border-line bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";

const labelClass = "mb-2 block text-sm font-semibold text-foreground";
const hintClass = "mt-1.5 text-xs text-muted";

export function ArticleForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Phase 1A: AI is not connected yet, so we only show a notice.
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-brand border border-line bg-surface p-5 shadow-sm sm:p-8"
    >
      <div className="grid gap-6">
        <div>
          <label htmlFor="keyword" className={labelClass}>
            Topic / main keyword <span className="text-accent">*</span>
          </label>
          <input
            id="keyword"
            name="keyword"
            type="text"
            required
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
            <select
              id="tone"
              name="tone"
              defaultValue={DEFAULTS.tone}
              className={fieldClass}
            >
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
            <select
              id="length"
              name="length"
              defaultValue={DEFAULTS.length}
              className={fieldClass}
            >
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
          className="w-full rounded-brand bg-accent px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 active:scale-[0.99]"
        >
          Generate Article
        </button>

        {submitted && (
          <p
            role="status"
            className="rounded-brand bg-accent/10 px-4 py-3 text-center text-sm text-accent"
          >
            AI is not connected yet — article generation is coming soon.
          </p>
        )}
      </div>
    </form>
  );
}
