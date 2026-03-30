import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { getPostBySlug } from "@/lib/queries";
import { toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found"
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const absoluteImageUrl = toAbsoluteUrl(post.coverImageUrl);

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    keywords: [post.title, post.category, "NAD+ article", "ZenUP blog"],
    openGraph: {
      type: "article",
      title: `${title} | ${siteConfig.title}`,
      description,
      url: `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      images: [
        {
          url: absoluteImageUrl,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.title}`,
      description,
      images: [absoluteImageUrl]
    }
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const paragraphs = post.content.split("\n\n");

  return (
    <section className="section">
      <div className="container">
        <div className="article-shell">
          <div className="article-hero">
            <p className="eyebrow">{post.category}</p>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="article-meta">
              <span>{formatDate(post.publishedAt)}</span>
              <span>{post.readTime} min read</span>
            </div>
          </div>
          <div className="panel">
            <Image src={post.coverImageUrl} alt={post.title} width={1200} height={740} />
          </div>
          <div className="article-content">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
