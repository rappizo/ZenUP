import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { CANONICAL_PRODUCT_PATH } from "@/lib/product-landing";
import { defaultOgImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Shop NAD+",
  description: "Go directly to the ZenUP NAD+ flagship product page and purchase flow.",
  alternates: {
    canonical: "/shop"
  },
  keywords: [
    "ZenUP NAD+",
    "shop nad plus",
    "buy nicotinamide riboside",
    "professional nad supplement"
  ],
  openGraph: {
    title: `Shop NAD+ | ${siteConfig.title}`,
    description: "Go directly to the ZenUP NAD+ flagship product page and purchase flow.",
    url: `${siteConfig.url}/shop`,
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Shop NAD+ | ${siteConfig.title}`,
    description: "Go directly to the ZenUP NAD+ flagship product page and purchase flow.",
    images: [defaultOgImage.url]
  }
};

export default async function ShopPage() {
  permanentRedirect(CANONICAL_PRODUCT_PATH);
}
