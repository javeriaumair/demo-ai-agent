import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AiWriter } from "@/components/illustrations/AiWriter";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const PERKS = [
  "SEO articles in under a minute",
  "English, Urdu & Roman Urdu",
  "Free plan — 5 articles every day",
];

// Split layout shared by /login and /signup: form on the left,
// always-dark neon illustration panel on the right (desktop only).
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </main>
      </div>

      <aside className="relative isolate hidden overflow-hidden bg-[#070814] p-10 text-white lg:flex lg:flex-col lg:justify-center">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -right-24 size-[28rem] rounded-full bg-violet-600/40 blur-[110px]" />
          <div className="absolute bottom-[-8rem] -left-20 size-[26rem] rounded-full bg-fuchsia-600/30 blur-[110px]" />
          <div className="absolute top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-[100px]" />
        </div>

        <div className="mx-auto w-full max-w-md">
          <AiWriter className="mx-auto w-full max-w-sm drop-shadow-[0_0_40px_rgba(236,72,153,0.3)]" />
          <h2 className="mt-8 text-3xl font-bold tracking-tight">
            Write smarter with <span className="text-brand-gradient">AI</span>
          </h2>
          <ul className="mt-6 grid gap-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-white/80">
                <span className="grid size-6 place-items-center rounded-full bg-white/10">
                  <Check className="size-4 text-emerald-300" aria-hidden />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
