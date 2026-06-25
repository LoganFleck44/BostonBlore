import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/Section";
import { posts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article>
      <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
        <Image src={post.cover} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-5 pb-10">
          <p className="text-xs uppercase tracking-widest text-flame">
            {new Date(post.date).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric" })} · {post.readingTime}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">{post.title}</h1>
        </div>
      </div>

      <Section className="!py-16">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-5 text-lg leading-relaxed text-bone/90">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-ink-600 bg-ink-700 p-8 text-center">
            <h2 className="font-display text-2xl font-bold uppercase">Want this dialed in for you?</h2>
            <p className="mt-2 text-ash">Get a custom training and nutrition plan built around your goals.</p>
            <div className="mt-5">
              <ButtonLink href="/signup" size="lg">Start Coaching</ButtonLink>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/blog" className="text-sm font-semibold uppercase tracking-wide text-ember hover:underline">
              ← Back to all posts
            </Link>
          </div>
        </div>
      </Section>
    </article>
  );
}
