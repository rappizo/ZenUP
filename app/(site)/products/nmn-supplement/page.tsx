import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NmnLandingPage } from "@/components/product/nmn-landing-page";
import {
  NMN_CANONICAL_PRODUCT_PATH,
  NMN_PRIMARY_PRODUCT_SLUG,
  NMN_PRODUCT_META_DESCRIPTION,
  NMN_PRODUCT_PRIMARY_KEYWORD,
  NMN_PRODUCT_SECONDARY_KEYWORDS,
  NMN_PRODUCT_SEO_TITLE,
  NMN_PRODUCT_SLUGS_BY_SIZE,
  normalizeNmnVariantSize,
  type NmnVariantSize
} from "@/lib/nmn-product";
import { getDefaultProductImageUrl } from "@/lib/product-media";
import { getProductBySlug, getPublishedReviewsByProductIds } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";

type NmnProductPageProps = {
  searchParams: Promise<{ size?: string; review?: string; error?: string }>;
};

async function loadNmnProducts() {
  const entries = await Promise.all(
    Object.entries(NMN_PRODUCT_SLUGS_BY_SIZE).map(async ([size, slug]) => {
      const product = await getProductBySlug(slug);
      return [size as NmnVariantSize, product] as const;
    })
  );

  const productsBySize = Object.fromEntries(entries) as Record<NmnVariantSize, Awaited<ReturnType<typeof getProductBySlug>>>;

  if (!productsBySize["60ct"] || !productsBySize["90ct"] || !productsBySize["120ct"]) {
    return null;
  }

  return productsBySize as Record<NmnVariantSize, NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug(NMN_PRIMARY_PRODUCT_SLUG);
  const imageUrl = product ? getDefaultProductImageUrl(product.slug) ?? product.imageUrl : "/icon.svg";

  return {
    title: NMN_PRODUCT_SEO_TITLE,
    description: NMN_PRODUCT_META_DESCRIPTION,
    keywords: [NMN_PRODUCT_PRIMARY_KEYWORD, ...NMN_PRODUCT_SECONDARY_KEYWORDS],
    alternates: {
      canonical: NMN_CANONICAL_PRODUCT_PATH
    },
    openGraph: {
      title: `${NMN_PRODUCT_SEO_TITLE} | ${siteConfig.title}`,
      description: NMN_PRODUCT_META_DESCRIPTION,
      url: `${siteConfig.url}${NMN_CANONICAL_PRODUCT_PATH}`,
      images: [
        {
          url: new URL(imageUrl, siteConfig.url).toString(),
          alt: "ZenUP NMN supplement bottle in premium packaging"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${NMN_PRODUCT_SEO_TITLE} | ${siteConfig.title}`,
      description: NMN_PRODUCT_META_DESCRIPTION,
      images: [new URL(imageUrl, siteConfig.url).toString()]
    }
  };
}

export default async function NmnProductPage({ searchParams }: NmnProductPageProps) {
  const [productsBySize, query] = await Promise.all([loadNmnProducts(), searchParams]);

  if (!productsBySize) {
    notFound();
  }

  const selectedSize = normalizeNmnVariantSize(query.size);
  const reviews = await getPublishedReviewsByProductIds(
    Object.values(productsBySize).map((product) => product.id)
  );

  return <NmnLandingPage productsBySize={productsBySize} selectedSize={selectedSize} reviews={reviews} query={query} />;
}
