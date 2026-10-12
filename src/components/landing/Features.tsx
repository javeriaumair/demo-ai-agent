import { FEATURES } from "@/lib/site-content";
import { SectionHeading } from "./SectionHeading";

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to rank"
          description="One keyword in, a complete SEO content package out."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="group relative rounded-brand border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10"
            >
              <span className="grid size-12 place-items-center rounded-brand bg-brand-gradient shadow-lg shadow-fuchsia-500/20">
                <Icon className="size-6 text-white" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-muted">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
