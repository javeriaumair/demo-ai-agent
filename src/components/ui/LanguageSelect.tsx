"use client";

import { ChevronDown, Globe } from "lucide-react";

const UI_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ur", label: "اردو" },
  { value: "roman-ur", label: "Roman Urdu" },
] as const;

// Website interface language. Design only for now — translations of the
// site itself are planned for a later phase (see PRD).
export function LanguageSelect({ className = "" }: { className?: string }) {
  return (
    <label
      className={`relative inline-flex h-10 items-center rounded-brand border border-line bg-surface text-sm text-foreground transition focus-within:ring-4 focus-within:ring-accent/20 hover:border-accent/50 ${className}`}
    >
      <span className="sr-only">Website language</span>
      <Globe className="pointer-events-none absolute left-3 size-4 text-muted" aria-hidden />
      <select
        defaultValue="en"
        className="h-full w-full cursor-pointer appearance-none rounded-brand bg-transparent pr-8 pl-9 outline-none"
      >
        {UI_LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 size-4 text-muted" aria-hidden />
    </label>
  );
}
