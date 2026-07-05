import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { NaturalBadge } from "@/components/NaturalBadge";
import { Section, SectionHeading } from "@/components/Section";
import { services, stats, testimonials } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-ink-800" />
          <div className="absolute -right-32 top-0 h-[600px] w-[600px] rounded-full bg-ember/15 blur-[120px]" />
          <div className="absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-flame/10 blur-[120px]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-24">
          <div className="animate-rise">
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] sm:text-6xl xl:text-7xl">
              Let's build something
              <br />
              you're <span className="fire-text">proud of</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ash">
              I'm Boston — a personal trainer and nutrition coach.
              I love helping people figure out what actually works for them and
              watching them make progress they didn't think was possible. Whether
              your goal is losing fat, building muscle, or stepping on stage —
              let's make a plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/signup" size="lg">
                Start Online Coaching
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" size="lg">
                Book a Free Consult
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm text-ash">
              Online coaching worldwide · In-person by enquiry
            </p>
          </div>

          <div className="relative animate-rise">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-ink-600 ember-glow">
              <Image
                src="/images/tnt-medal-frontdouble.jpg"
                alt="Boston Blore on stage at the TNT Muscle Showdown"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div className="border-y border-ink-600 bg-ink-800/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-ink-600 px-5 md:grid-cols-4 md:divide-x">
            {stats.map((s) => (
              <div key={s.label} className="px-2 py-7 text-center">
                <p className="font-display text-3xl font-bold fire-text sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-ash">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT INTRO */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-2xl border border-ink-600 lg:order-1">
            <Image
              src="/images/medal-celebration.jpg"
              alt="Boston Blore celebrating with his medal on stage"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="The Approach"
              title={<>Coaching built<br />around <span className="fire-text">your life</span></>}
              intro="I've spent years learning what actually moves the needle — naturally, sustainably, and without making the process miserable. My goal is to take all of that and make it work for you specifically, not just hand you a generic plan and wish you luck."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Programs designed around your schedule and equipment",
                "Real adjustments every week based on how you're progressing",
                "A coach who genuinely cares about your long-term growth",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ember" />
                  <span className="text-ash">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/about" variant="outline" size="lg">Learn More About Me</ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section className="border-t border-ink-600 bg-ink-800/40">
        <SectionHeading
          center
          eyebrow="Coaching"
          title="Ways to work together"
          intro="Training and nutrition, online or in person — whichever fits your life best."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.slug}
              href="/services"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-600 bg-ink-700 transition hover:border-ember/50 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover transition duration-500 group-hover:scale-105 ${s.imagePosition ?? ""}`}
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold uppercase">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ash">
                  {s.blurb}
                </p>
                <span className="mt-4 text-sm font-semibold uppercase tracking-wide text-ember">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section>
        <SectionHeading
          center
          eyebrow="How It Works"
          title="Simple from the start"
          intro="Getting started is straightforward — no complicated onboarding, no guesswork about what to do next."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {[
            { n: "01", t: "Sign up", d: "Create your account and tell me about your goals, schedule, and what equipment you have." },
            { n: "02", t: "Get your plan", d: "I put together your custom training split and nutrition plan inside your dashboard." },
            { n: "03", t: "Train & log", d: "Follow your program, log your sessions, and track how things are progressing." },
            { n: "04", t: "Check in weekly", d: "Send a weekly update; I review it, adjust your plan, and message you back." },
          ].map((step) => (
            <div key={step.n} className="rounded-2xl border border-ink-600 bg-ink-700 p-6">
              <p className="font-display text-4xl font-bold text-ink-600">{step.n}</p>
              <h3 className="mt-2 font-display text-lg font-semibold uppercase">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{step.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/signup" size="lg">Start Your Plan</ButtonLink>
        </div>
      </Section>

      {/* NUTRITION SPOTLIGHT */}
      <Section className="border-t border-ink-600 bg-ink-800/40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Nutrition Coaching"
              title={<>Food that<br />actually <span className="fire-text">fits your life</span></>}
              intro="Nutrition coaching isn't about cutting out everything you enjoy. It's about building habits that work long-term — ones you can sustain well past any 12-week challenge."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Macro targets based on your body and goals",
                "Flexible meal structure with real food",
                "Grocery lists and meal prep guidance",
                "Adjusted week to week as your body responds",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ember" />
                  <span className="text-ash">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/services#nutrition-coaching" size="lg">Learn About Nutrition Coaching</ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ink-600">
            <Image
              src="/images/meal-prep.jpg"
              alt="Meal prepped containers with rice, broccoli, and protein — practical, sustainable nutrition"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <SectionHeading
          center
          eyebrow="Results"
          title="What clients say"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-2xl border border-ink-600 bg-ink-700 p-6">
              <div className="mb-3 text-ember">★★★★★</div>
              <blockquote className="flex-1 text-sm leading-relaxed text-bone">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 border-t border-ink-600 pt-4">
                <p className="font-display font-semibold uppercase">{t.name}</p>
                <p className="text-xs text-flame">{t.result}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ember-600 to-ember" />
        <div className="absolute inset-0 -z-10 opacity-20 mix-blend-overlay">
          <Image
            src="/images/plate-row.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold uppercase leading-tight text-white sm:text-5xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Whether you know exactly what you want or you're not sure where to begin —
            reach out and we'll figure it out together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/signup" size="lg" className="bg-ink text-white hover:bg-ink-800">
              Start Coaching
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline" className="border-white/60 text-white hover:border-white hover:text-white">
              Book a Free Consult
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
