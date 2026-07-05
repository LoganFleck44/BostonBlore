import Image from "next/image";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/Section";
import { testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Results & Transformations",
  description:
    "Real, natural results from Boston Blore and his coaching clients. Drug-free transformations built to last.",
};

const gallery = [
  { src: "/images/tnt-medal-frontdouble.jpg", label: "TNT Muscle Showdown", note: "Classic Physique — First Overall" },
  { src: "/images/stage-most-muscular.jpg", label: "IFBB Competition", note: "Toronto Pro Qualifier" },
  { src: "/images/stage-sidechest-pose.jpg", label: "IFBB / NPC Stage", note: "National level" },
  { src: "/images/preacher-curl.jpg", label: "Off-Season Training", note: "The work behind the result" },
];

const transformations = [
  {
    src: "/images/progressphoto-lashawn.jpg",
    name: "LaShawn",
    result: "Leaner, stronger, and more confident",
    note: "Months of consistent training and nutrition coaching.",
  },
];

export default function ResultsPage() {
  return (
    <>
      <Section>
        <SectionHeading
          center
          eyebrow="Results"
          title="Real work, real results"
          intro="From everyday clients hitting personal milestones to competition prep — here's what consistent, honest coaching looks like."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((g) => (
            <div key={g.src} className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-ink-600">
              <Image
                src={g.src}
                alt={g.label}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-4">
                <p className="font-display text-sm font-semibold uppercase">{g.label}</p>
                <p className="text-xs text-flame">{g.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-ink-600 bg-ink-800/40">
        <SectionHeading
          center
          eyebrow="Client Transformations"
          title="Before & after"
          intro="Real, natural progress from clients who put in the work — no shortcuts, no gimmicks, just consistent coaching over time."
        />
        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
          {transformations.map((t) => (
            <figure
              key={t.src}
              className="overflow-hidden rounded-2xl border border-ink-600 bg-ink-700"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={t.src}
                  alt={`${t.name} — before and after transformation`}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bone">
                  Before / After
                </span>
              </div>
              <figcaption className="p-5">
                <p className="font-display text-lg font-semibold uppercase">{t.name}</p>
                <p className="text-sm text-flame">{t.result}</p>
                <p className="mt-1 text-xs text-ash">{t.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section className="border-t border-ink-600">
        <SectionHeading center eyebrow="Client Stories" title="In their words" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-ink-600 bg-ink-700 p-6">
              <div className="mb-3 text-ember">★★★★★</div>
              <blockquote className="flex-1 text-sm leading-relaxed text-bone">“{t.quote}”</blockquote>
              <figcaption className="mt-5 border-t border-ink-600 pt-4">
                <p className="font-display font-semibold uppercase">{t.name}</p>
                <p className="text-xs text-flame">{t.result}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/signup" size="lg">Start Your Transformation</ButtonLink>
        </div>
      </Section>
    </>
  );
}
