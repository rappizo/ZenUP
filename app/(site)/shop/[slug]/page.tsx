import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductLandingPage } from "@/components/product/product-landing-page";
import {
  getNmnSizeFromSlug,
  isNmnVariantSlug,
  NMN_CANONICAL_PRODUCT_PATH,
  NMN_PRODUCT_META_DESCRIPTION,
  NMN_PRODUCT_PRIMARY_KEYWORD,
  NMN_PRODUCT_SECONDARY_KEYWORDS,
  NMN_PRODUCT_SEO_TITLE
} from "@/lib/nmn-product";
import {
  CANONICAL_PRODUCT_PATH,
  PRODUCT_LANDING_META_DESCRIPTION,
  PRODUCT_LANDING_PRIMARY_KEYWORD,
  PRODUCT_LANDING_SECONDARY_KEYWORDS,
  PRODUCT_LANDING_SEO_TITLE
} from "@/lib/product-landing";
import { getProductBySlug, getPublishedReviewsByProductId } from "@/lib/queries";
import { getDefaultProductImageUrl } from "@/lib/product-media";
import { siteConfig } from "@/lib/site-config";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ review?: string; error?: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isNmnVariantSlug(slug)) {
    const product = await getProductBySlug(slug);
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

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found"
    };
  }

  const imageUrl = getDefaultProductImageUrl(product.slug) ?? product.imageUrl;

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

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);

  if (isNmnVariantSlug(slug)) {
    const selectedSize = getNmnSizeFromSlug(slug);
    redirect(`${NMN_CANONICAL_PRODUCT_PATH}?size=${selectedSize || "120ct"}`);
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getPublishedReviewsByProductId(product.id);

  return <ProductLandingPage product={product} reviews={reviews} query={query} />;
}
