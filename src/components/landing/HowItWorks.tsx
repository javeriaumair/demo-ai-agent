import { STEPS } from "@/lib/site-content";
import { SectionHeading } from "./SectionHeading";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-surface-2/60 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="From keyword to article in 3 steps"
        />

        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* connecting line on desktop */}
          <div
            aria-hidden
            className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-brand-gradient opacity-40 md:block"
          />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative text-center">
              <span className="relative mx-auto grid size-14 place-items-center rounded-full bg-brand-gradient text-xl font-bold text-white shadow-lg shadow-fuchsia-500/30 ring-8 ring-background">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
