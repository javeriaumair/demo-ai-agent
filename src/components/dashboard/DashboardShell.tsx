"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HistoryIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  PenLine,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Not built yet — shown with a "Soon" badge and disabled. */
  soon?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "New Article", icon: PenLine },
  { href: "/dashboard/history", label: "History", icon: HistoryIcon, soon: true },
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard, soon: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, soon: true },
];

// Free plan limit (see PRD). The exact remaining count is shown after each generation.
const DAILY_LIMIT = 5;

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex min-h-dvh flex-1">
      {/* mobile backdrop */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-surface px-4 py-5 transition-transform duration-200 lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full max-lg:invisible"}`}
      >
        <div className="flex items-center justify-between px-2">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-brand text-muted hover:bg-surface-2 lg:hidden"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav className="mt-8 flex-1" aria-label="Dashboard">
          <ul className="grid gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon, soon }) => {
              const active = pathname === href;
              const base = "flex items-center gap-3 rounded-brand px-3 py-2.5 text-sm font-medium transition";

              if (soon) {
                return (
                  <li key={href}>
                    <span aria-disabled className={`${base} cursor-not-allowed text-muted/70`}>
                      <Icon className="size-5" aria-hidden />
                      {label}
                      <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-muted">
                        Soon
                      </span>
                    </span>
                  </li>
                );
              }

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`${base} ${active ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface-2 hover:text-foreground"}`}
                  >
                    <Icon className="size-5" aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="rounded-brand border border-line bg-surface-2 p-4">
          <p className="text-sm font-semibold">Free plan</p>
          <p className="mt-1 text-xs text-muted">Up to {DAILY_LIMIT} articles per day</p>
        </div>

        <Link
          href="/"
          className="mt-3 flex items-center gap-3 rounded-brand px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-foreground"
        >
          <LogOut className="size-5" aria-hidden />
          Back to website
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="dashboard-sidebar"
              className="grid size-10 place-items-center rounded-brand border border-line bg-surface text-foreground lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
            <p className="font-semibold">Dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span
              aria-label="Guest user"
              className="grid size-10 place-items-center rounded-full bg-brand-gradient text-sm font-semibold text-white"
            >
              G
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
