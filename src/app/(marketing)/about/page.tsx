import Image from "next/image";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { NaturalBadge } from "@/components/NaturalBadge";
import { Section, SectionHeading } from "@/components/Section";
import { credentials, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Boston Blore is a personal trainer and nutrition coach — passionate about helping people build real, lasting results.",
};

export default function AboutPage() {
  return (
    <>
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="About"
              title={<>Hi, I'm <span className="fire-text">Boston</span></>}
            />
            <div className="mt-6 space-y-4 text-ash leading-relaxed">
              <p>
                I'm a personal trainer and nutrition coach.
                The short version: I genuinely love this stuff, and I love helping
                people get somewhere they didn't think they could reach.
              </p>
              <p>
                I've been competing as a classic & open bodybuilder since I was
                19 years old at the CPA level, and the experience of going through that
                process — figuring out training, nutrition, and the mental side
                of it — is a big part of what I bring to coaching. Not because
                competing makes me better than anyone, but because I've lived
                through the trial and error so you don't have to start from scratch.
              </p>
              <p>
                Whether you want to lose weight, put on muscle, feel better in
                your day-to-day, or eventually step on a stage — I want to help
                you get there. We'll build something that fits your life and
                actually works long-term.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/signup" size="lg">Work With Me</ButtonLink>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold uppercase tracking-wide text-ember hover:underline"
              >
                {site.instagramHandle} →
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-ink-600">
            <Image
              src="/images/ifbb-stage-sidechest.jpg"
              alt="Boston Blore competing on stage"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* SPLIT — training photo + what drives him */}
      <Section className="border-t border-ink-600 bg-ink-800/40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-ink-600">
            <Image
              src="/images/preacher-curl.jpg"
              alt="Boston training in the gym"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="What drives me"
              title={<>The process<br />is the <span className="fire-text">point</span></>}
            />
            <div className="mt-6 space-y-4 text-ash leading-relaxed">
              <p>
                The thing I find most rewarding isn't any result I've hit myself
                — it's watching a client hit a milestone they weren't sure was
                possible. First pull-up, first real cut, first show. That stuff
                never gets old.
              </p>
              <p>
                I coach anyone who wants to get stronger, feel better, or work
                toward a goal — whatever that looks like for you. I happen to
                compete myself, but what I care about is
                helping you build something real. That means training that makes
                sense, food that fits your life, and progress you can actually
                feel.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {credentials.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-ink-600 px-3 py-1.5 text-xs font-medium text-ash"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* VALUES */}
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Built around you",
              d: "Your program is built around your schedule, equipment, and where you're starting from — not a template.",
            },
            {
              t: "Honest coaching",
              d: "I'll tell you what's actually going to work, even if that's less exciting than what you were hoping to hear.",
            },
            {
              t: "Long-term thinking",
              d: "The goal is results you can maintain — not a 6-week fix that falls apart when the program ends.",
            },
          ].map((v) => (
            <div key={v.t} className="rounded-2xl border border-ink-600 bg-ink-700 p-7">
              <h3 className="font-display text-xl font-semibold uppercase">{v.t}</h3>
              <p className="mt-3 text-ash leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
