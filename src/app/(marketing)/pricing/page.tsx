import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/Section";
import { packages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing & Packages",
  description:
    "Online training, full transformation (training + nutrition), and in-person 1-on-1 coaching packages with Boston Blore.",
};

export default function PricingPage() {
  return (
    <>
      <Section>
        <SectionHeading
          center
          eyebrow="Pricing"
          title="Choose your plan"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                p.highlighted
                  ? "border-ember bg-ink-700 ember-glow"
                  : "border-ink-600 bg-ink-700"
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ember px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Best Value
                </span>
              )}
              <h3 className="font-display text-xl font-semibold uppercase">{p.name}</h3>
              <p className="mt-2 text-sm text-ash">{p.description}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="font-display text-4xl font-bold fire-text">{p.price}</span>
                <span className="mb-1 text-sm text-ash">{p.cadence}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 text-ember">✓</span>
                    <span className="text-bone">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink
                  href={p.name === "In-Person 1:1" ? "/contact" : "/signup"}
                  variant={p.highlighted ? "primary" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {p.cta}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ash">
          Payments are handled after you sign up and complete onboarding.
        </p>
      </Section>
    </>
  );
}
