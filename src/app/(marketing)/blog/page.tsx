import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/Section";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Training, nutrition, and natural bodybuilding insights from Boston Blore.",
};

export default function BlogPage() {
  return (
    <Section>
      <SectionHeading
        center
        eyebrow="Blog"
        title="Train smarter, naturally"
        intro="Practical, no-hype articles on training, nutrition, and building a natural physique."
      />
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-ink-600 bg-ink-700 transition hover:border-ember/50 hover:-translate-y-1"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={p.cover}
                alt={p.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs uppercase tracking-widest text-ash">
                {new Date(p.date).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })} · {p.readingTime}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ash">{p.excerpt}</p>
              <span className="mt-4 text-sm font-semibold uppercase tracking-wide text-ember">Read →</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
