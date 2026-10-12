"use client";

import { Moon, Sun } from "lucide-react";

// The current theme lives on <html data-theme> (set before paint in
// layout.tsx). Both icons are rendered and CSS picks one, so the server
// and client markup always match and there is no hydration flash.
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode); the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`grid size-10 place-items-center rounded-brand border border-line bg-surface text-foreground transition hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 ${className}`}
    >
      <Moon className="size-5 dark:hidden" aria-hidden />
      <Sun className="hidden size-5 dark:block" aria-hidden />
    </button>
  );
}
