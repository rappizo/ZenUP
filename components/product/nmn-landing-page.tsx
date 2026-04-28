import Link from "next/link";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductFaqAccordion } from "@/components/product/product-faq-accordion";
import { ProductMediaFrame } from "@/components/product/product-media-frame";
import { ProductReviewsShowcase } from "@/components/product/product-reviews-showcase";
import { RatingStars } from "@/components/ui/rating-stars";
import { addToCartAction } from "@/app/(site)/cart/actions";
import { formatCurrency } from "@/lib/format";
import {
  NMN_CANONICAL_PRODUCT_PATH,
  NMN_PRODUCT_META_DESCRIPTION,
  NMN_PRODUCT_PRIMARY_KEYWORD,
  type NmnVariantSize
} from "@/lib/nmn-product";
import {
  getDefaultProductImageUrl,
  getLocalProductGallery,
  getProductDetailImages
} from "@/lib/product-media";
import { siteConfig } from "@/lib/site-config";
import type { ProductRecord, ProductReviewRecord } from "@/lib/types";

const benefitCards = [
  {
    title: "Daily cellular wellness support",
    body:
      "Built around NMN with a fuller supporting stack, the formula is positioned for customers who want an elevated daily supplement instead of a crowded routine."
  },
  {
    title: "Clean healthy-aging positioning",
    body:
      "The presentation stays modern, premium, and easy to scan, helping the product feel trustworthy without leaning on exaggerated wellness claims."
  },
  {
    title: "Multi-ingredient value story",
    body:
      "Quercetin, Resveratrol, CoQ10, and Astaxanthin help the bottle read like a more complete daily offering, not just a single-note ingredient play."
  }
];

const ingredientCards = [
  {
    title: "NMN",
    body:
      "NMN leads the formula story and gives the product a focused daily wellness identity for shoppers researching premium NAD+-adjacent support."
  },
  {
    title: "Quercetin + Resveratrol",
    body:
      "This pairing helps the formula feel broader, more intentional, and more premium for customers comparing ingredient depth across the category."
  },
  {
    title: "CoQ10 + Astaxanthin",
    body:
      "CoQ10 and Astaxanthin round out the blend with added everyday wellness support, making the bottle feel more complete as part of a steady routine."
  }
];

const formulaReasons = [
  {
    title: "One polished formula",
    body:
      "The ingredient story feels edited and purposeful, which helps shoppers understand the bottle quickly without bouncing between multiple product pages."
  },
  {
    title: "Three capsule-count options",
    body:
      "60ct, 90ct, and 120ct formats make it easier to choose the bottle that fits trial, reorder cadence, or long-term daily use."
  },
  {
    title: "Premium shelf presence",
    body:
      "Amber-gold packaging and a more structured formula story give the product a refined supplement-brand feel instead of a generic marketplace look."
  },
  {
    title: "Built for consistent use",
    body:
      "The goal is a bottle that feels easy to keep on hand, easy to understand, and easy to return to as part of a stable daily wellness habit."
  }
];

const routinePoints = [
  "Choose the capsule count that best fits how often you plan to keep the formula in rotation.",
  "A cleaner single-bottle stack can help the routine feel easier to maintain from week to week.",
  "The bottle is designed to feel premium enough for the counter, but straightforward enough for daily use.",
  "Review the label and supplement facts panel for complete ingredient and serving details before use."
];

const ritualCards = [
  {
    title: "Refined everyday format",
    body:
      "The bottle size options make it easier to match the product to short-term trial, regular use, or a longer daily rhythm."
  },
  {
    title: "Premium wellness presentation",
    body:
      "Warm amber, soft gold, and clean typography help the page feel elevated and consumer-facing without looking clinical."
  },
  {
    title: "Easy next purchase decision",
    body:
      "Customers can compare counts and pricing in one place, then move directly into checkout without hunting through a product grid."
  }
];

const faqItems = [
  {
    question: "What is NMN?",
    answer:
      "NMN is a wellness ingredient commonly discussed in formulas centered on daily cellular wellness and NAD+-related routines. In this product, it serves as the leading ingredient in a broader premium blend."
  },
  {
    question: "Why does this formula include Quercetin and Resveratrol?",
    answer:
      "Quercetin and Resveratrol help the formula feel more complete for customers who prefer a broader daily wellness blend instead of a single-ingredient bottle."
  },
  {
    question: "Why are CoQ10 and Astaxanthin part of the formula?",
    answer:
      "CoQ10 and Astaxanthin help reinforce the product's premium everyday-wellness positioning and round out the ingredient story in a more polished way."
  },
  {
    question: "What is the difference between 60ct, 90ct, and 120ct?",
    answer:
      "The formula positioning stays the same, while the bottle count changes so shoppers can choose the size that best fits trial, routine consistency, or longer-term use."
  },
  {
    question: "Is this supplement designed for daily use?",
    answer:
      "The product is presented as part of a consistent daily wellness routine. As with any dietary supplement, it is best to review the label and supplement facts to decide how it fits into your day."
  },
  {
    question: "What makes this ZenUP NMN page different?",
    answer:
      "It combines a premium formula story, clear size options, and a cleaner purchase flow so the customer can compare value and choose the right bottle more confidently."
  }
];

type NmnLandingPageProps = {
  productsBySize: Record<NmnVariantSize, ProductRecord>;
  selectedSize: NmnVariantSize;
  reviews: ProductReviewRecord[];
  query?: {
    review?: string;
    error?: string;
  };
};

function getCapsuleCountLabel(size: NmnVariantSize) {
  return `${size.replace("ct", "")} Veggie Capsules`;
}

export function NmnLandingPage({
  productsBySize,
  selectedSize,
  reviews,
  query
}: NmnLandingPageProps) {
  const product = productsBySize[selectedSize];
  const galleryImages = getLocalProductGallery(product.slug);
  const detailImages = getProductDetailImages(product.slug);
  const heroImage = getDefaultProductImageUrl(product.slug) ?? product.imageUrl;
  const displayGallery = galleryImages.length > 0 ? galleryImages : [heroImage];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

  const ingredientImage = detailImages[0] ?? detailImages[1] ?? heroImage;
  const formulaFeatureImage = detailImages[2] ?? detailImages[3] ?? null;
  const routineImage = detailImages[5] ?? detailImages[4] ?? null;
  const ritualImage = detailImages[7] ?? detailImages[6] ?? null;
  const finalImage = detailImages[6] ?? detailImages[4] ?? null;

  const heroFeaturePoints = [
    "Daily NMN Wellness Support",
    "With Quercetin + Resveratrol",
    getCapsuleCountLabel(selectedSize)
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: NMN_PRODUCT_META_DESCRIPTION,
        sku: product.productCode,
        image: [heroImage, ...detailImages.slice(0, 3)]
          .filter(Boolean)
          .map((image) => new URL(image, siteConfig.url).toString()),
        brand: {
          "@type": "Brand",
          name: siteConfig.name
        },
        offers: {
          "@type": "Offer",
          url: `${siteConfig.url}${NMN_CANONICAL_PRODUCT_PATH}?size=${selectedSize}`,
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

        <div className="product-landing product-landing--nmn">
          <section className="product-landing__hero">
            <div className="product-landing__hero-copy">
              <p className="eyebrow">{NMN_PRODUCT_PRIMARY_KEYWORD}</p>
              <h1>NMN Supplement for Daily Cellular Wellness Support</h1>
              <p className="product-landing__hero-text">
                Explore ZenUP NMN with Quercetin, Resveratrol, CoQ10, and Astaxanthin in a premium
                daily formula designed to feel clean, modern, and easy to keep in rotation.
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
                  <strong className="product-price-stack__sale">
                    {formatCurrency(product.priceCents, product.currency)}
                  </strong>
                </div>

                <p className="product-landing__price-copy">
                  {product.shortDescription}
                </p>

                <div className="product-landing__variant-grid" aria-label="Choose capsule count">
                  {Object.entries(productsBySize).map(([size, variantProduct]) => {
                    const typedSize = size as NmnVariantSize;
                    const active = typedSize === selectedSize;

                    return (
                      <Link
                        key={variantProduct.id}
                        href={`${NMN_CANONICAL_PRODUCT_PATH}?size=${typedSize}#buy`}
                        className={`product-landing__variant-link${active ? " product-landing__variant-link--active" : ""}`}
                      >
                        <strong>{typedSize}</strong>
                        <span>{formatCurrency(variantProduct.priceCents, variantProduct.currency)}</span>
                      </Link>
                    );
                  })}
                </div>

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
                alt={`${product.name} bottle in ${getCapsuleCountLabel(selectedSize).toLowerCase()} format`}
              />
            </div>
          </section>

          <section className="product-landing__section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Key Benefits</p>
              <h2>Premium daily support with a warmer, more lifestyle-led formula story.</h2>
              <p className="section-heading__description">
                The page stays conversion-focused, with one formula story, one clean purchase area,
                and three bottle-count options that are easy to compare.
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
              <h2>One centered image, then the formula story in a cleaner horizontal scan.</h2>
              <p className="section-heading__description">
                NMN leads the product identity, while the supporting ingredients help the bottle feel
                deeper, more complete, and more premium for daily use.
              </p>
            </div>

            <div className="product-landing__ingredient-showcase">
              <ProductMediaFrame
                src={ingredientImage}
                alt="ZenUP NMN supplement in premium packaging"
                ratio="four-three"
                priority
                sizes="100vw"
                placeholderLabel="Ingredient spotlight image"
              />

              <div className="product-landing__ingredient-grid">
                {ingredientCards.map((ingredient) => (
                  <article key={ingredient.title} className="panel product-landing__card">
                    <h3>{ingredient.title}</h3>
                    <p>{ingredient.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="product-landing__section">
            <div className="product-landing__formula-layout">
              <div className="product-landing__formula-copy">
                <div className="section-heading">
                  <p className="section-heading__eyebrow">Why This Formula</p>
                  <h2>A smarter daily wellness offer with clearer count and price choices.</h2>
                  <p className="section-heading__description">
                    Instead of showing a product grid first, the page keeps the decision tight: one
                    formula, three size formats, and a cleaner explanation of why the stack feels worth it.
                  </p>
                </div>

                <p className="product-landing__support-copy">
                  This is the kind of supplement page that helps a consumer decide faster. The bottle
                  count options, ingredient depth, and premium presentation all sit in one place, so
                  the next step feels obvious instead of scattered.
                </p>

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
                <ProductMediaFrame
                  src={formulaFeatureImage}
                  alt="ZenUP NMN supplement bottle detail"
                  ratio="two-three"
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 44vw, 34vw"
                  placeholderLabel="Formula image"
                />
              </div>
            </div>
          </section>

          <section className="product-landing__section">
            <div className="product-landing__routine-layout">
              <div className="product-landing__routine-copy">
                <div className="section-heading">
                  <p className="section-heading__eyebrow">Daily Routine</p>
                  <h2>Easy to keep on hand, easy to size to your routine.</h2>
                  <p className="section-heading__description">
                    The product is designed to look premium, feel approachable, and fit naturally into
                    a consistent wellness habit without asking the customer to decode too much.
                  </p>
                </div>

                <p className="product-landing__support-copy">
                  Choosing between 60ct, 90ct, and 120ct helps the product work for first orders,
                  steady repeat orders, and longer routine windows. That makes the page feel more
                  useful and more conversion-friendly than a single fixed bottle size.
                </p>

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
                  alt="ZenUP NMN supplement in a premium daily routine setting"
                  ratio="two-three"
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 44vw, 32vw"
                  placeholderLabel="Routine image"
                />
              </div>
            </div>
          </section>

          <section className="product-landing__section">
            <div className="product-landing__lifestyle-layout">
              <div className="product-landing__lifestyle-top">
                <ProductMediaFrame
                  src={ritualImage}
                  alt="ZenUP NMN supplement displayed as part of a premium wellness lifestyle"
                  ratio="landscape"
                  sizes="(max-width: 720px) 100vw, (max-width: 1180px) 48vw, 38vw"
                  placeholderLabel="Lifestyle image"
                />

                <div className="product-landing__lifestyle-copy">
                  <div className="section-heading">
                    <p className="section-heading__eyebrow">Daily Ritual Fit</p>
                    <h2>Made to look at home in a consumer routine, not just a supplement catalog.</h2>
                    <p className="section-heading__description">
                      The visual system shifts warmer here so the page feels closer to the bottle:
                      amber, gold, clean neutrals, and a simpler premium-buy experience.
                    </p>
                  </div>

                  <p className="product-landing__support-copy">
                    Because the formula is sold in three counts, this section helps the product feel
                    adaptable instead of rigid. It works as a polished first purchase and still scales
                    into a longer everyday rhythm.
                  </p>
                </div>
              </div>

              <div className="product-landing__lifestyle-grid">
                {ritualCards.map((card) => (
                  <article key={card.title} className="panel product-landing__card">
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="product-landing__section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Frequently Asked Questions</p>
              <h2>Frequently Asked Questions</h2>
              <p className="section-heading__description">
                Clear, consumer-facing answers about NMN, the supporting stack, and how to think about
                the different bottle counts.
              </p>
            </div>
            <ProductFaqAccordion items={faqItems} />
          </section>

          <section id="reviews" className="product-landing__section">
            <div className="section-heading">
              <p className="section-heading__eyebrow">Customer Feedback</p>
              <h2>See how shoppers talk about the formula and the daily-use experience.</h2>
              <p className="section-heading__description">
                Reviews keep the page grounded in real-world purchase context while the main purchase
                flow stays simple and easy to follow.
              </p>
            </div>
            <ProductReviewsShowcase reviews={reviews} averageRating={averageRating} initialCount={6} increment={6} />
          </section>

          <section className="product-landing__section">
            <div className="product-landing__final-cta">
              <div className="product-landing__final-copy">
                <p className="eyebrow">ZENUP NMN DAILY WELLNESS</p>
                <h2>Choose the ZenUP NMN size that fits your routine.</h2>
                <p>
                  Start with 60ct, step into 90ct, or go straight to 120ct for a fuller daily rhythm.
                  The formula, presentation, and purchase flow are all designed to make the next step feel clean.
                </p>
                <div className="hero-actions">
                  <Link href="#buy" className="button button--primary">
                    Shop Now
                  </Link>
                </div>
              </div>

              <ProductMediaFrame
                src={finalImage}
                alt="ZenUP NMN supplement hero closing image"
                ratio="portrait"
                sizes="(max-width: 720px) 100vw, (max-width: 1180px) 44vw, 26vw"
                placeholderLabel="Closing product image"
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
