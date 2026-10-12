import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_COLUMNS } from "@/lib/site-content";
import { primaryButtonClass } from "@/lib/ui";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      {/* closing call to action */}
      <div className="mx-auto max-w-6xl px-4 pt-16">
        <div className="relative isolate overflow-hidden rounded-brand bg-[#070814] px-6 py-12 text-center text-white sm:px-12">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/4 size-72 rounded-full bg-violet-600/40 blur-[90px]" />
            <div className="absolute -bottom-24 right-1/4 size-72 rounded-full bg-fuchsia-600/30 blur-[90px]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to write your <span className="text-brand-gradient">next article</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/70">
            Join LikhoAI for free and create your first SEO article in under a minute.
          </p>
          <Link href="/signup" className={`${primaryButtonClass} mt-8 px-8 py-4`}>
            Get Started Free
            <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-muted">
            AI-powered SEO content in English, Urdu and Roman Urdu.
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold">{column.title}</h3>
            <ul className="mt-4 grid gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted transition hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line px-4 py-6 text-center text-sm text-muted">
        © LikhoAI. All rights reserved.
      </div>
    </footer>
  );
}
