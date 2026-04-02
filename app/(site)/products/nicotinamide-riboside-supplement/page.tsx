import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductLandingPage } from "@/components/product/product-landing-page";
import {
  LEGACY_PRODUCT_SLUG,
  CANONICAL_PRODUCT_PATH,
  PRODUCT_LANDING_META_DESCRIPTION,
  PRODUCT_LANDING_PRIMARY_KEYWORD,
  PRODUCT_LANDING_SECONDARY_KEYWORDS,
  PRODUCT_LANDING_SEO_TITLE
} from "@/lib/product-landing";
import { getProductBySlug, getPublishedReviewsByProductId } from "@/lib/queries";
import { getDefaultProductImageUrl } from "@/lib/product-media";
import { siteConfig } from "@/lib/site-config";

type CanonicalProductPageProps = {
  searchParams: Promise<{ review?: string; error?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug(LEGACY_PRODUCT_SLUG);
  const imageUrl = product ? getDefaultProductImageUrl(product.slug) ?? product.imageUrl : "/icon.svg";

  return {
    title: PRODUCT_LANDING_SEO_TITLE,
    description: PRODUCT_LANDING_META_DESCRIPTION,
    keywords: [PRODUCT_LANDING_PRIMARY_KEYWORD, ...PRODUCT_LANDING_SECONDARY_KEYWORDS],
    alternates: {
      canonical: CANONICAL_PRODUCT_PATH
    },
    openGraph: {
      title: `${PRODUCT_LANDING_SEO_TITLE} | ${siteConfig.title}`,
      description: PRODUCT_LANDING_META_DESCRIPTION,
      url: `${siteConfig.url}${CANONICAL_PRODUCT_PATH}`,
      images: [
        {
          url: new URL(imageUrl, siteConfig.url).toString(),
          alt: "Nicotinamide Riboside supplement bottle with CoQ10 and Resveratrol"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${PRODUCT_LANDING_SEO_TITLE} | ${siteConfig.title}`,
      description: PRODUCT_LANDING_META_DESCRIPTION,
      images: [new URL(imageUrl, siteConfig.url).toString()]
    }
  };
}

export default async function CanonicalProductPage({ searchParams }: CanonicalProductPageProps) {
  const [product, query] = await Promise.all([getProductBySlug(LEGACY_PRODUCT_SLUG), searchParams]);

  if (!product) {
    notFound();
  }

  const reviews = await getPublishedReviewsByProductId(product.id);

  return <ProductLandingPage product={product} reviews={reviews} query={query} />;
}
