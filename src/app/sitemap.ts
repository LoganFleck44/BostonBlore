import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";

const base = "https://bostonblore.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/services", "/pricing", "/results", "/faq", "/contact", "/blog"].map(
    (r) => ({ url: `${base}${r}`, lastModified: new Date() })
  );
  const blog = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...routes, ...blog];
}
