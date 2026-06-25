import Image from "next/image";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/Section";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coaching & Services",
  description:
    "Online training coaching, nutrition coaching, and in-person 1-on-1 personal training in Lloydminster, AB with Boston Blore.",
};

export default function ServicesPage() {
  return (
    <>
      <Section>
        <SectionHeading
          center
          eyebrow="Coaching"
          title="Ways to work together"
          intro="Three ways to work with me — all built on natural, sustainable methods and real coaching."
        />
      </Section>

      <div className="space-y-px">
        {services.map((s, i) => (
          <Section
            key={s.slug}
            id={s.slug}
            className={i % 2 === 1 ? "bg-ink-800/40 border-y border-ink-600" : ""}
          >
            <div
              className={`grid items-center gap-12 lg:grid-cols-2 ${
                i % 2 === 1 ? "" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                {s.featured && (
                  <span className="mb-3 inline-block rounded-full bg-ember px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Most Popular
                  </span>
                )}
                <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-4 text-ash leading-relaxed">{s.blurb}</p>
                <ul className="mt-6 space-y-3">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ember" />
                      <span className="text-bone">{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ButtonLink href="/signup" size="lg">
                    Get Started
                  </ButtonLink>
                </div>
              </div>
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-600 ${
                  i % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Section>
        ))}
      </div>

      <Section className="border-t border-ink-600">
        <div className="rounded-2xl border border-ink-600 bg-gradient-to-br from-ink-700 to-ink-800 p-10 text-center">
          <h2 className="font-display text-3xl font-bold uppercase">
            Not sure which is right for you?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ash">
            Book a free consult and we'll figure out the best path to your goals together.
          </p>
          <div className="mt-6">
            <ButtonLink href="/contact" size="lg">Book a Free Consult</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
