import Link from "next/link";
import { Sparkles } from "lucide-react";

type LogoProps = {
  href?: string;
  /** Force white text, e.g. on the always-dark auth illustration panel. */
  light?: boolean;
};

export function Logo({ href = "/", light = false }: LogoProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
      aria-label="LikhoAI home"
    >
      <span className="grid size-9 place-items-center rounded-[11px] bg-brand-gradient shadow-md shadow-fuchsia-500/30">
        <Sparkles className="size-5 text-white" aria-hidden />
      </span>
      <span
        className={`text-xl font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}
      >
        Likho<span className="text-brand-gradient">AI</span>
      </span>
    </Link>
  );
}
