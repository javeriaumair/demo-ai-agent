import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/site-content";
import { primaryButtonClass } from "@/lib/ui";
import { SectionHeading } from "./SectionHeading";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Upgrade later."
          description="LikhoAI is free while we grow. Pro plans arrive in a later phase."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-brand p-px ${plan.highlighted ? "bg-brand-gradient shadow-xl shadow-fuchsia-500/20" : "bg-line"}`}
            >
              <div className="flex h-full flex-col rounded-[14px] bg-surface p-7">
                {plan.highlighted && (
                  <span className="absolute -top-3 left-7 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
                    Available now
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted">{plan.description}</p>
                <p className="mt-5 text-3xl font-bold">
                  {plan.price}
                  {plan.period && (
                    <span className="ml-1 text-base font-normal text-muted">/ {plan.period}</span>
                  )}
                </p>
                <ul className="mt-6 grid flex-1 gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={
                    plan.highlighted
                      ? `${primaryButtonClass} mt-8`
                      : "mt-8 rounded-brand border border-line px-6 py-3 text-center font-semibold transition hover:border-accent/50 hover:text-accent"
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
