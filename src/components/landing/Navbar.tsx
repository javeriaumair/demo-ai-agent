"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSelect } from "@/components/ui/LanguageSelect";
import { NAV_LINKS } from "@/lib/site-content";
import { primaryButtonClass } from "@/lib/ui";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-18">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-brand px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <LanguageSelect className="w-34" />
          <Link
            href="/login"
            className="rounded-brand px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-2"
          >
            Login
          </Link>
          <Link href="/signup" className={`${primaryButtonClass} px-5 py-2.5 text-sm`}>
            Get Started Free
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-brand border border-line bg-surface text-foreground"
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-background px-4 pt-3 pb-5 lg:hidden">
          <ul className="grid gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block rounded-brand px-3 py-3 text-base font-medium text-foreground hover:bg-surface-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3">
            <LanguageSelect className="w-full" />
            <Link
              href="/login"
              onClick={close}
              className="rounded-brand border border-line px-4 py-3 text-center font-semibold text-foreground"
            >
              Login
            </Link>
            <Link href="/signup" onClick={close} className={primaryButtonClass}>
              Get Started Free
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
