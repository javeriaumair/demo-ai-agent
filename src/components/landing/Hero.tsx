import Link from "next/link";
import { ArrowRight, Check, Gauge, Languages, Sparkles } from "lucide-react";
import { NeuralBrain } from "@/components/illustrations/NeuralBrain";
import { primaryButtonClass } from "@/lib/ui";

// The hero is always dark (in both themes) so the neon gradients glow.
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#070814] text-white">
      {/* neon background blobs + subtle grid */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 size-[32rem] rounded-full bg-violet-600/40 blur-[120px]" />
        <div className="absolute top-20 right-[-10rem] size-[30rem] rounded-full bg-fuchsia-600/30 blur-[120px]" />
        <div className="absolute bottom-[-12rem] left-1/3 size-[28rem] rounded-full bg-sky-500/25 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:pt-20 lg:grid-cols-2 lg:gap-8 lg:pt-24 lg:pb-28">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur">
            <Sparkles className="size-4 text-fuchsia-300" aria-hidden />
            AI content writer for Pakistan &amp; beyond
          </p>

          <h1 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Write SEO articles <span className="text-brand-gradient">10x faster</span> with AI
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70 lg:mx-0">
            Give LikhoAI a keyword. Get an outline, a full SEO article, meta tags and FAQs — in
            English, Urdu or Roman Urdu.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/signup" className={`${primaryButtonClass} w-full px-7 py-4 sm:w-auto`}>
              Get Started Free
              <ArrowRight className="size-5" aria-hidden />
            </Link>
            <Link
              href="/#how-it-works"
              className="w-full rounded-brand border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
            >
              See how it works
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60 lg:justify-start">
            {["Free forever plan", "No credit card", "5 articles / day"].map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-emerald-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <NeuralBrain className="w-full drop-shadow-[0_0_40px_rgba(168,85,247,0.35)]" />

          {/* floating glass chips */}
          <div className="absolute top-[12%] left-0 hidden rounded-brand border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md motion-safe:animate-float sm:block">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-[11px] bg-emerald-400/20">
                <Gauge className="size-5 text-emerald-300" aria-hidden />
              </span>
              <div>
                <p className="text-xs text-white/60">SEO score</p>
                <p className="text-lg font-bold">96 / 100</p>
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-[14%] hidden rounded-brand border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md motion-safe:animate-float [animation-delay:-3s] sm:block">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-[11px] bg-sky-400/20">
                <Languages className="size-5 text-sky-300" aria-hidden />
              </span>
              <div>
                <p className="text-xs text-white/60">Languages</p>
                <p className="font-semibold">English · اردو · Roman</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
