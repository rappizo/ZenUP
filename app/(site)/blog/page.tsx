import type { Metadata } from "next";
import { PostCard } from "@/components/ui/post-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedPosts } from "@/lib/queries";
import { defaultOgImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the ZenUP blog for NAD+, Nicotinamide Riboside, healthy-aging, and supplement routine guidance.",
  alternates: {
    canonical: "/blog"
  },
  keywords: [
    "ZenUP blog",
    "NAD+ guide",
    "nicotinamide riboside article",
    "healthy aging blog",
    "supplement routine tips"
  ],
  openGraph: {
    title: `Blog | ${siteConfig.title}`,
    description:
      "Read the ZenUP blog for NAD+, Nicotinamide Riboside, healthy-aging, and supplement routine guidance.",
    url: `${siteConfig.url}/blog`,
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.title}`,
    description:
      "Read the ZenUP blog for NAD+, Nicotinamide Riboside, healthy-aging, and supplement routine guidance.",
    images: [defaultOgImage.url]
  }
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="eyebrow">Blog</p>
          <h1>Educational content rewritten for a focused NAD+ supplement brand.</h1>
          <p>
            This section now supports the ZenUP product story with ingredient explainers, buying
            guidance, and consistency-focused daily routine articles.
          </p>
          <div className="page-hero__stats">
            <span className="pill">{posts.length} articles</span>
            <span className="pill">NAD+ education</span>
            <span className="pill">Routine guidance</span>
          </div>
        </div>

        <div className="section">
          <SectionHeading
            eyebrow="Latest articles"
            title="Browse content that supports the product story instead of distracting from it."
            description="The article library is now aligned with supplement shoppers researching NAD+, NR dosage, ingredient pairing, and daily-use consistency."
          />
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
