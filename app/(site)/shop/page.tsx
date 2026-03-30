import type { Metadata } from "next";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getActiveProducts } from "@/lib/queries";
import { defaultOgImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the ZenUP catalog, currently focused on one flagship NAD+ supplement.",
  alternates: {
    canonical: "/shop"
  },
  keywords: [
    "ZenUP shop",
    "NAD+ supplement",
    "buy nicotinamide riboside",
    "healthy aging supplement",
    "NR supplement with resveratrol"
  ],
  openGraph: {
    title: `Shop | ${siteConfig.title}`,
    description: "Browse the ZenUP catalog, currently focused on one flagship NAD+ supplement.",
    url: `${siteConfig.url}/shop`,
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Shop | ${siteConfig.title}`,
    description: "Browse the ZenUP catalog, currently focused on one flagship NAD+ supplement.",
    images: [defaultOgImage.url]
  }
};

export default async function ShopPage() {
  const products = await getActiveProducts();

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="eyebrow">Shop ZenUP</p>
          <h1>A focused storefront built around one premium NAD+ formula.</h1>
          <p>
            The catalog currently centers on ZenUP NAD+ so shoppers can move directly from formula
            review to purchase without unnecessary distractions.
          </p>
          <div className="page-hero__stats">
            <span className="pill">{products.length} flagship product</span>
            <span className="pill">120 veggie capsules</span>
            <span className="pill">United States shipping</span>
          </div>
        </div>
        <div className="section">
          <SectionHeading
            eyebrow="Current Catalog"
            title="One hero product now, more detailed landing pages later."
            description="This version of the site keeps the shopping flow tight while you continue building richer assets and future product pages."
          />
          <div className="product-grid product-grid--single">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
