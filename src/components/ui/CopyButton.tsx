"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  /** Text to copy, or a function that builds it at click time. */
  text: string | (() => string);
  label?: string;
  className?: string;
};

export function CopyButton({ text, label = "Copy", className = "" }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(typeof text === "function" ? text() : text);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-brand border border-line bg-surface px-3 py-2 text-sm font-medium text-foreground transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 ${className}`}
    >
      {state === "copied" ? (
        <Check className="size-4 text-emerald-500" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      <span aria-live="polite">
        {state === "copied" ? "Copied!" : state === "failed" ? "Copy failed" : label}
      </span>
    </button>
  );
}
