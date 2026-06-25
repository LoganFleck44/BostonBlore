export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  cover: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "natural-vs-enhanced-what-to-expect",
    title: "Natural vs. Enhanced: What Results Should You Actually Expect?",
    excerpt:
      "The internet is full of physiques built on substances. Here's what a realistic, drug-free transformation timeline looks like.",
    date: "2026-05-28",
    readingTime: "6 min read",
    cover: "/images/ifbb-stage-sidechest.jpg",
    body: [
      "If you've ever felt like your progress is too slow, it's worth asking who you're comparing yourself to. A huge share of the physiques you see online are built with the help of performance-enhancing drugs — and that completely changes the timeline and the ceiling.",
      "As a natural athlete, I want you to have an honest benchmark. In your first year of consistent, intelligent training and nutrition, a beginner can realistically build a noticeable amount of muscle and dramatically change their body composition. After that, progress slows — and that's normal, not failure.",
      "The good news: natural results are the ones you keep. There's no crash when you stop a cycle, no health gamble, and no dependence on anything but your own habits. That's the entire point of how I coach.",
      "Focus on the levers that actually move the needle: progressive overload, enough protein, sleep, and consistency over months and years. Do that, and you'll be shocked how far natural can take you.",
    ],
  },
  {
    slug: "build-a-split-that-fits-your-life",
    title: "How to Build a Training Split That Actually Fits Your Life",
    excerpt:
      "The best program is the one you'll do. Here's how I structure splits around real schedules.",
    date: "2026-05-12",
    readingTime: "5 min read",
    cover: "/images/preacher-curl.jpg",
    body: [
      "The 'perfect' split doesn't exist in a vacuum — it exists relative to your week. A 6-day bodybuilder split is useless if you can only train 3 days. When I build a client's program, the first question isn't 'what's optimal,' it's 'what's sustainable for you.'",
      "If you've got 3 days, full-body or an upper/lower hybrid hits every muscle with enough frequency. With 4 days, upper/lower twice over is hard to beat. At 5–6 days, we can run a true push/pull/legs and chase more volume per muscle group.",
      "Whatever the frequency, the principles stay the same: train each muscle hard enough to grow, recover enough to come back stronger, and progress the weight or reps over time. The split is just the container.",
      "When you train with me online, this is exactly what your first program is built around — your real availability, equipment, and goals — and we adjust it every week.",
    ],
  },
  {
    slug: "nutrition-without-the-misery",
    title: "Nutrition Without the Misery: Eating for Results You Can Sustain",
    excerpt:
      "Crash diets work until they don't. Here's how to eat for a physique you can actually maintain.",
    date: "2026-04-30",
    readingTime: "7 min read",
    cover: "/images/plate-row.jpg",
    body: [
      "Most people don't fail because they don't know what to eat. They fail because the plan they're on is impossible to live with. Extreme deficits, banned foods, and rigid meal timing all crumble the moment real life shows up.",
      "My approach to nutrition coaching is built around adherence first. We set realistic calorie and macro targets, build a meal structure around foods you actually like, and give you swap options so you're never stuck.",
      "Protein is the non-negotiable — it protects muscle whether you're cutting or building. After that, we have far more flexibility than most diets pretend. You can hit your goals and still eat meals you enjoy.",
      "Sustainable nutrition isn't a 12-week sprint. It's the set of habits that keep you lean and strong long after any 'challenge' ends — and that's what we build together.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
