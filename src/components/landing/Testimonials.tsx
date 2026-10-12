import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site-content";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20 bg-surface-2/60 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by writers and small businesses"
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <li key={t.role} className="flex flex-col rounded-brand border border-line bg-surface p-6">
              <Quote className="size-8 text-accent/40" aria-hidden />
              <div className="mt-3 flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-foreground">“{t.quote}”</blockquote>
              <div className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-full bg-brand-gradient font-semibold text-white"
                >
                  {t.role.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
