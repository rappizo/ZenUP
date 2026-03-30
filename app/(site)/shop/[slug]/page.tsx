import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { submitProductReviewAction } from "@/app/(site)/account/actions";
import { addToCartAction } from "@/app/(site)/cart/actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductReviewsShowcase } from "@/components/product/product-reviews-showcase";
import { ButtonLink } from "@/components/ui/button-link";
import { RatingStars } from "@/components/ui/rating-stars";
import { getCurrentCustomerId } from "@/lib/customer-auth";
import { formatCurrency, getSavingsCents } from "@/lib/format";
import {
  getCustomerAccountById,
  getProductBySlug,
  getPublishedReviewsByProductId
} from "@/lib/queries";
import { toAbsoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const formulaHighlights = [
  {
    title: "Nicotinamide Riboside centered",
    body:
      "The formula leads with 600mg Nicotinamide Riboside Hydrogen Malate per serving so the product clearly belongs in the NAD+ category."
  },
  {
    title: "Built as a complete stack",
    body:
      "Quercetin Phytosome, Trans-Resveratrol, and CoQ10 help the product feel like a finished daily system instead of a single-ingredient capsule."
  },
  {
    title: "Transparent and easy to evaluate",
    body:
      "Clear serving size, 60 servings per bottle, and a visible supplement facts panel create a more credible supplement shopping experience."
  }
];

const dailyUseNotes = [
  "Take 2 veggie capsules daily.",
  "Use consistently as part of a healthy-aging or cellular-energy routine.",
  "Review the supplement facts panel and ingredient list before use.",
  "Consult your healthcare professional if you are pregnant, nursing, taking medication, or managing a medical condition."
];

const faqItems = [
  {
    title: "What makes this product different from an NR-only formula?",
    body:
      "ZenUP is positioned as a more complete NAD+ daily stack. Instead of stopping at Nicotinamide Riboside alone, it also includes Quercetin Phytosome, Trans-Resveratrol, and CoQ10."
  },
  {
    title: "How many servings are in each bottle?",
    body:
      "Each bottle contains 120 veggie capsules. At 2 capsules per serving, that gives customers 60 servings per bottle."
  },
  {
    title: "Who is this product designed for?",
    body:
      "The page is written for customers looking for an ingredient-led NAD+ supplement to support a more consistent healthy-aging and daily wellness routine."
  }
];

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ review?: string; error?: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found"
    };
  }

  const title = product.name;
  const description = product.shortDescription;
  const absoluteImageUrl = toAbsoluteUrl(product.imageUrl);

  return {
    title,
    description,
    keywords: [
      product.name,
      "NAD+ supplement",
      "nicotinamide riboside",
      "healthy aging supplement",
      "quercetin phytosome",
      "resveratrol coq10"
    ],
    alternates: {
      canonical: `/shop/${product.slug}`
    },
    openGraph: {
      title: `${title} | ${siteConfig.title}`,
      description,
      url: `${siteConfig.url}/shop/${product.slug}`,
      images: [
        {
          url: absoluteImageUrl,
          alt: product.name
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

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const [product, customerId, query] = await Promise.all([
    getProductBySlug(slug),
    getCurrentCustomerId(),
    searchParams
  ]);

  if (!product) {
    notFound();
  }

  const [reviews, account] = await Promise.all([
    getPublishedReviewsByProductId(product.id),
    customerId ? getCustomerAccountById(customerId) : Promise.resolve(null)
  ]);

  const displayGallery = product.galleryImages.length > 0 ? product.galleryImages : [product.imageUrl];
  const canReview = Boolean(account?.purchasedProductIds.includes(product.id));
  const savingsCents = getSavingsCents(product.compareAtPriceCents, product.priceCents);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.productCode,
    image: displayGallery.slice(0, 8).map((image) => new URL(image, siteConfig.url).toString()),
    brand: {
      "@type": "Brand",
      name: siteConfig.name
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/shop/${product.slug}`,
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    ...(reviews.length > 0 && product.averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.averageRating.toFixed(1)),
            reviewCount: reviews.length
          }
        }
      : {})
  };

  return (
    <section className="section section--product">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="product-detail">
          <ProductGallery images={displayGallery} alt={product.name} />
          <div className="product-detail__copy">
            <h1>{product.name}</h1>
            <p>{product.tagline}</p>

            <div className="product-price-stack product-price-stack--detail">
              {product.compareAtPriceCents ? (
                <span className="product-price-stack__original">
                  {formatCurrency(product.compareAtPriceCents, product.currency)}
                </span>
              ) : null}
              <strong className="product-price-stack__sale">
                {formatCurrency(product.priceCents, product.currency)}
              </strong>
              {savingsCents > 0 ? (
                <span className="product-price-stack__off">
                  {formatCurrency(savingsCents, product.currency)} Off
                </span>
              ) : null}
            </div>

            <div className="product-detail__rating">
              <RatingStars
                rating={product.averageRating}
                reviewCount={product.reviewCount}
                showCount
                size="md"
              />
              <a href="#reviews" className="link-inline">
                See customer reviews
              </a>
            </div>

            <p>{product.description}</p>
            <div className="product-detail__facts">
              <span className="pill">120 veggie capsules</span>
              <span className="pill">60 servings</span>
              <span className="pill">Dietary supplement</span>
              <span className="pill">Daily NAD+ support</span>
            </div>

            <form action={addToCartAction} className="checkout-form">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="redirectTo" value="/cart?status=added" />
              <div className="field">
                <label htmlFor="quantity">Quantity</label>
                <select id="quantity" name="quantity" defaultValue="1">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <button type="submit" className="button button--primary">
                Add to cart
              </button>
            </form>

            <ul className="detail-list">
              {product.details.split("\n").map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>

            <div className="stack-row">
              <ButtonLink href="/shop" variant="secondary">
                Back to shop
              </ButtonLink>
              <ButtonLink href="/cart" variant="ghost">
                View cart
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="product-page-stack">
          <section className="product-page-section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Formula Highlights</p>
              <h2>A cleaner supplement page built around transparency and stack logic.</h2>
              <p className="section-heading__description">
                The new product layout focuses on why the formula exists, what is inside it, and
                how it fits into a real customer routine.
              </p>
            </div>
            <div className="story-sections">
              {formulaHighlights.map((item) => (
                <article key={item.title} className="panel">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="product-page-section product-routine">
            <div className="product-routine__copy">
              <p className="eyebrow">Daily Use</p>
              <h2>Simple instructions make a premium supplement easier to trust and easier to repeat.</h2>
              <p>
                The page now explains the routine clearly instead of leaning on vague claims. That
                helps the product feel more disciplined, more premium, and more believable.
              </p>
              <div className="product-routine__steps">
                {dailyUseNotes.map((note, index) => (
                  <article key={note} className="product-routine__step">
                    <span className="product-routine__index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{note}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel">
              <p className="eyebrow">Important note</p>
              <h3>Dietary supplement disclaimer</h3>
              <p>
                These statements have not been evaluated by the Food and Drug Administration. This
                product is not intended to diagnose, treat, cure, or prevent any disease.
              </p>
            </div>
          </section>

          <section className="product-page-section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">FAQ</p>
              <h2>What serious shoppers usually want to know before buying.</h2>
            </div>
            <div className="story-sections">
              {faqItems.map((item) => (
                <article key={item.title} className="panel">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="reviews" className="product-page-section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Product reviews</p>
              <h2>What customers are saying about this formula.</h2>
              <p className="section-heading__description">
                Reviews are published after purchase so new shoppers can browse real feedback with
                confidence.
              </p>
            </div>

            {query.review === "submitted" ? (
              <p className="notice">Your review was submitted and is waiting for approval.</p>
            ) : null}
            {query.error === "review-not-eligible" ? (
              <p className="notice">
                Only customers with a completed purchase can review this product.
              </p>
            ) : null}

            <div className="review-stack">
              <ProductReviewsShowcase reviews={reviews} averageRating={product.averageRating} />

              <section className="admin-form review-form-panel">
                <h2>Leave a review</h2>
                {canReview ? (
                  <form action={submitProductReviewAction}>
                    <input type="hidden" name="productId" value={product.id} />
                    <input type="hidden" name="productSlug" value={product.slug} />
                    <div className="field">
                      <label htmlFor="rating">Rating</label>
                      <select id="rating" name="rating" defaultValue="5">
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="title">Review title</label>
                      <input id="title" name="title" required />
                    </div>
                    <div className="field">
                      <label htmlFor="content">Your review</label>
                      <textarea id="content" name="content" required />
                    </div>
                    <button type="submit" className="button button--primary">
                      Submit review
                    </button>
                  </form>
                ) : (
                  <p>Review submission becomes available after you complete a purchase.</p>
                )}
              </section>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
