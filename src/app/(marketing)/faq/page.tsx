import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/Section";
import { faqs } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about natural coaching, online training, and working with Boston Blore.",
};

export default function FaqPage() {
  return (
    <Section>
      <SectionHeading center eyebrow="FAQ" title="Questions, answered" />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-ink-600 rounded-2xl border border-ink-600 bg-ink-700">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
              {f.q}
              <span className="text-ember transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-ash leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-10 text-center">
        <p className="text-ash">Still have a question?</p>
        <div className="mt-4">
          <ButtonLink href="/contact" size="lg">Get in Touch</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
