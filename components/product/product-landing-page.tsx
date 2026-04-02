import Link from "next/link";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductFaqAccordion } from "@/components/product/product-faq-accordion";
import { ProductMediaFrame } from "@/components/product/product-media-frame";
import { ProductReviewsShowcase } from "@/components/product/product-reviews-showcase";
import { RatingStars } from "@/components/ui/rating-stars";
import { addToCartAction } from "@/app/(site)/cart/actions";
import { formatCurrency, getSavingsCents } from "@/lib/format";
import {
  CANONICAL_PRODUCT_PATH,
  PRODUCT_LANDING_META_DESCRIPTION,
  PRODUCT_LANDING_PRIMARY_KEYWORD
} from "@/lib/product-landing";
import {
  getDefaultProductImageUrl,
  getLocalProductGallery,
  getProductDetailImages,
  getProductSupplementFactsImageUrl
} from "@/lib/product-media";
import { siteConfig } from "@/lib/site-config";
import type { ProductRecord, ProductReviewRecord } from "@/lib/types";

const heroFeaturePoints = [
  "Daily NAD+ Support",
  "With CoQ10 & Resveratrol",
  "120 Veggie Capsules"
];

const benefitCards = [
  {
    title: "Daily NAD+ Support",
    body:
      "Built around Nicotinamide Riboside, this formula is designed for customers who want a premium supplement focused on daily NAD+ support."
  },
  {
    title: "Healthy Aging Support",
    body:
      "The formula is positioned as part of a consistent wellness routine, helping the product feel calm, modern, and supportive without overpromising."
  },
  {
    title: "Antioxidant & Cellular Wellness",
    body:
      "CoQ10 and Resveratrol round out the blend with a more complete daily wellness story centered on cellular wellness and antioxidant support."
  }
];

const ingredientCards = [
  {
    title: "Nicotinamide Riboside",
    body:
      "Often referred to as NR, Nicotinamide Riboside is the core of this formula and is widely used in wellness supplements centered on daily NAD+ support."
  },
  {
    title: "CoQ10",
    body:
      "CoQ10 helps position the formula around everyday cellular wellness support, making the blend feel more complete for daily use."
  },
  {
    title: "Resveratrol",
    body:
      "Resveratrol adds antioxidant support to the formula and complements the premium wellness positioning of the blend."
  }
];

const formulaReasons = [
  {
    title: "Thoughtfully paired ingredients",
    body:
      "The formula combines Nicotinamide Riboside with CoQ10 and Resveratrol in one bottle for a more polished daily wellness blend."
  },
  {
    title: "Easy-to-take veggie capsules",
    body:
      "120 veggie capsules keep the product simple to understand and easy to work into an everyday supplement routine."
  },
  {
    title: "Designed for everyday wellness routines",
    body:
      "The product is built to fit into a steady daily habit rather than a complicated supplement stack."
  },
  {
    title: "Premium supplement positioning",
    body:
      "The bottle, formula, and presentation are designed to feel clean, elevated, and trustworthy for modern wellness shoppers."
  }
];

const routinePoints = [
  "Designed to fit easily into a consistent daily wellness routine.",
  "Works best when used as part of a calm, repeatable everyday habit.",
  "Review the product label and supplement facts for complete serving information before use.",
  "A simple format and 120 veggie capsules make the formula easy to keep on hand."
];

const faqItems = [
  {
    question: "What is Nicotinamide Riboside?",
    answer:
      "Nicotinamide Riboside is often referred to as NR and is commonly used in wellness formulas focused on daily NAD+ support. In this formula, it serves as the core ingredient in a more complete premium supplement blend."
  },
  {
    question: "How is Nicotinamide Riboside related to NAD+ support?",
    answer:
      "NR is widely discussed in the NAD+ category because it is commonly used in supplements designed around daily NAD+ support. That is why it often appears in wellness routines focused on consistent everyday use."
  },
  {
    question: "Why is CoQ10 included in this formula?",
    answer:
      "CoQ10 is included to give the blend a more complete daily wellness profile and to support the formula's cellular wellness positioning."
  },
  {
    question: "What does Resveratrol add to the formula?",
    answer:
      "Resveratrol adds antioxidant support to the formula and helps round out the overall premium wellness blend."
  },
  {
    question: "Is this supplement suitable for daily use?",
    answer:
      "This supplement is designed to support a consistent wellness routine. As with any dietary supplement, it is best to review the label and serving information to decide how it fits into your day."
  },
  {
    question: "What makes this NR supplement different?",
    answer:
      "This formula combines Nicotinamide Riboside with CoQ10 and Resveratrol for a more complete daily wellness blend, while keeping the presentation clean, premium, and easy to understand."
  }
];

type ProductLandingPageProps = {
  product: ProductRecord;
  reviews: ProductReviewRecord[];
  query?: {
    review?: string;
    error?: string;
  };
};

export function ProductLandingPage({ product, reviews, query }: ProductLandingPageProps) {
  const galleryImages = getLocalProductGallery(product.slug);
  const detailImages = getProductDetailImages(product.slug);
  const supplementFactsImage = getProductSupplementFactsImageUrl(product.slug);
  const heroImage = getDefaultProductImageUrl(product.slug) ?? product.imageUrl;
  const displayGallery = galleryImages.length > 0 ? galleryImages : [heroImage];
  const savingsCents = getSavingsCents(product.compareAtPriceCents, product.priceCents);
  const averageRating =
    typeof product.averageRating === "number"
      ? product.averageRating
      : reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : null;

  const primaryPortrait = detailImages[0] ?? heroImage;
  const doctorProofImage = detailImages[1] ?? heroImage;
  const ingredientScene = detailImages[2] ?? detailImages[3] ?? heroImage;
  const formulaLifestyleImage = detailImages[4] ?? detailImages[5] ?? heroImage;
  const routineImage = detailImages[5] ?? detailImages[6] ?? heroImage;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: PRODUCT_LANDING_META_DESCRIPTION,
        sku: product.productCode,
        image: [heroImage, ...detailImages.slice(0, 3)].map((image) => new URL(image, siteConfig.url).toString()),
        brand: {
          "@type": "Brand",
          name: siteConfig.name
        },
        offers: {
          "@type": "Offer",
          url: `${siteConfig.url}${CANONICAL_PRODUCT_PATH}`,
          priceCurrency: product.currency,
          price: (product.priceCents / 100).toFixed(2),
          availability:
            product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        },
        ...(averageRating && reviews.length > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(averageRating.toFixed(1)),
                reviewCount: reviews.length
              }
            }
          : {})
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    ]
  };

  return (
    <section className="section section--product">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="product-landing">
          <section className="product-landing__hero">
            <div className="product-landing__hero-copy">
              <p className="eyebrow">{PRODUCT_LANDING_PRIMARY_KEYWORD}</p>
              <h1>Nicotinamide Riboside Supplement for Daily NAD+ Support</h1>
              <p className="product-landing__hero-text">
                Discover a premium Nicotinamide Riboside supplement featuring CoQ10, Resveratrol,
                and 120 veggie capsules for daily wellness, healthy aging support, and a more
                complete NAD+ support routine.
              </p>

              {averageRating ? (
                <div className="product-landing__rating-row">
                  <RatingStars rating={averageRating} reviewCount={reviews.length} size="md" showCount />
                  <a href="#reviews" className="link-inline">
                    See customer reviews
                  </a>
                </div>
              ) : null}

              <div className="product-landing__trust-row">
                {heroFeaturePoints.map((point) => (
                  <span key={point} className="pill">
                    {point}
                  </span>
                ))}
              </div>

              <div className="product-landing__price-panel" id="buy">
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
                      Save {formatCurrency(savingsCents, product.currency)}
                    </span>
                  ) : null}
                </div>

                <p className="product-landing__price-copy">
                  {product.shortDescription}
                </p>

                <form action={addToCartAction} className="product-landing__purchase-form">
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
                    Shop Now
                  </button>
                  <Link href="#formula" className="button button--secondary">
                    Explore the Formula
                  </Link>
                </form>
              </div>

              {(query?.review === "submitted" || query?.error === "review-not-eligible") ? (
                <p className="notice">
                  {query.review === "submitted"
                    ? "Your review was submitted and is waiting for approval."
                    : "Only customers with a completed purchase can review this product."}
                </p>
              ) : null}
            </div>

            <div className="product-landing__hero-media">
              <ProductGallery
                images={displayGallery}
                alt="Nicotinamide Riboside supplement bottle with CoQ10 and Resveratrol"
              />
            </div>
          </section>

          <section className="product-landing__section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Key Benefits</p>
              <h2>Premium daily wellness support, made easy to understand.</h2>
              <p className="section-heading__description">
                A clear structure, familiar ingredients, and a clean presentation help the formula
                feel trustworthy from the first screen.
              </p>
            </div>
            <div className="product-landing__benefit-grid">
              {benefitCards.map((benefit) => (
                <article key={benefit.title} className="panel product-landing__card">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="formula" className="product-landing__section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Ingredient Spotlight</p>
              <h2>Why This Formula Stands Out</h2>
              <p className="section-heading__description">
                The formula is built around Nicotinamide Riboside, then strengthened with supporting
                ingredients that add clarity and value to the daily wellness story.
              </p>
            </div>

            <div className="product-landing__ingredient-layout">
              <div className="product-landing__ingredient-grid">
                {ingredientCards.map((ingredient) => (
                  <article key={ingredient.title} className="panel product-landing__card">
                    <h3>{ingredient.title}</h3>
                    <p>{ingredient.body}</p>
                  </article>
                ))}
              </div>

              <div className="product-landing__ingredient-visuals">
                <ProductMediaFrame
                  src={primaryPortrait}
                  alt="NAD+ support supplement in premium packaging"
                  ratio="portrait"
                  priority
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 46vw, 26vw"
                />
                <ProductMediaFrame
                  src={ingredientScene}
                  alt="NR supplement bottle in a premium editorial scene"
                  ratio="landscape"
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 46vw, 26vw"
                />
              </div>
            </div>
          </section>

          <section className="product-landing__section">
            <div className="product-landing__formula-layout">
              <div className="product-landing__formula-copy">
                <div className="section-heading">
                  <p className="section-heading__eyebrow">Why This Formula</p>
                  <h2>A Smarter Daily Wellness Formula</h2>
                  <p className="section-heading__description">
                    Every part of the blend is designed to support a more polished everyday routine,
                    without cluttering the offer or overcomplicating the decision.
                  </p>
                </div>

                <div className="product-landing__reason-grid">
                  {formulaReasons.map((reason) => (
                    <article key={reason.title} className="panel product-landing__card">
                      <h3>{reason.title}</h3>
                      <p>{reason.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="product-landing__formula-visuals">
                {supplementFactsImage ? (
                  <ProductMediaFrame
                    src={supplementFactsImage}
                    alt="Supplement facts panel for Nicotinamide Riboside supplement with CoQ10 and Resveratrol"
                    ratio="wide"
                    sizes="(max-width: 720px) 100vw, (max-width: 1180px) 44vw, 32vw"
                  />
                ) : null}
                <div className="product-landing__formula-secondary">
                  <ProductMediaFrame
                    src={formulaLifestyleImage}
                    alt="Nicotinamide Riboside supplement bottle presented in a premium lifestyle setting"
                    ratio="landscape"
                    sizes="(max-width: 720px) 100vw, (max-width: 1180px) 44vw, 32vw"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="product-landing__section">
            <div className="product-landing__routine-layout">
              <div className="product-landing__routine-copy">
                <div className="section-heading">
                  <p className="section-heading__eyebrow">Daily Routine</p>
                  <h2>Easy to Add to Your Daily Routine</h2>
                  <p className="section-heading__description">
                    This supplement is designed to fit naturally into an everyday wellness routine,
                    with a clean format that feels straightforward to keep on hand.
                  </p>
                </div>

                <div className="product-landing__routine-points">
                  {routinePoints.map((point, index) => (
                    <article key={point} className="product-landing__routine-point">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{point}</p>
                    </article>
                  ))}
                </div>

                <p className="product-landing__routine-note">
                  As with any dietary supplement, review the product label and supplement facts for
                  complete use information before adding it to your routine.
                </p>
              </div>

              <div className="product-landing__routine-visuals">
                <ProductMediaFrame
                  src={routineImage}
                  alt="NR supplement capsules for daily wellness"
                  ratio="portrait"
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 44vw, 28vw"
                />
                <ProductMediaFrame
                  src={heroImage}
                  alt="NAD+ support supplement in premium packaging"
                  ratio="square"
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 36vw, 18vw"
                />
              </div>
            </div>
          </section>

          <section className="product-landing__section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Frequently Asked Questions</p>
              <h2>Frequently Asked Questions</h2>
              <p className="section-heading__description">
                Clear answers for shoppers who want to understand the role of NR, CoQ10, and
                Resveratrol in a daily wellness formula.
              </p>
            </div>
            <ProductFaqAccordion items={faqItems} />
          </section>

          <section id="reviews" className="product-landing__section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Customer Feedback</p>
              <h2>See how shoppers describe the formula in real use.</h2>
              <p className="section-heading__description">
                Published reviews add social proof without distracting from the main purchase flow.
              </p>
            </div>
            <ProductReviewsShowcase reviews={reviews} averageRating={averageRating} initialCount={6} increment={6} />
          </section>

          <section className="product-landing__section">
            <div className="product-landing__final-cta">
              <div className="product-landing__final-copy">
                <p className="eyebrow">ZENUP - A DR. PROOF BRAND</p>
                <h2>Support Your Daily Wellness Routine with Nicotinamide Riboside</h2>
                <p>
                  Choose a premium Nicotinamide Riboside supplement designed for daily NAD+ support,
                  healthy aging support, and a cleaner everyday wellness routine with CoQ10 and
                  Resveratrol already built in.
                </p>
                <div className="hero-actions">
                  <Link href="#buy" className="button button--primary">
                    Shop Now
                  </Link>
                </div>
              </div>

              <ProductMediaFrame
                src={doctorProofImage}
                alt="Nicotinamide Riboside supplement presented by a medical professional"
                ratio="portrait"
                sizes="(max-width: 720px) 100vw, (max-width: 1180px) 44vw, 26vw"
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
