import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeBannerSlider } from "@/components/home/home-banner-slider";
import { PostCard } from "@/components/ui/post-card";
import { RatingStars } from "@/components/ui/rating-stars";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatCurrency, getSavingsCents } from "@/lib/format";
import { NMN_CANONICAL_PRODUCT_PATH, NMN_PRIMARY_PRODUCT_SLUG } from "@/lib/nmn-product";
import { CANONICAL_PRODUCT_PATH, LEGACY_PRODUCT_SLUG, getCanonicalProductPath } from "@/lib/product-landing";
import { getDefaultProductImageUrl } from "@/lib/product-media";
import {
  getProductBySlug,
  getPublishedPosts,
  getPublishedReviewsByProductIds,
  getStoreSettings
} from "@/lib/queries";
import { hasConfiguredEmailDelivery, resolveStorefrontContact, siteConfig } from "@/lib/site-config";
import { buildSiteImageUrl } from "@/lib/site-media";
import {
  getSubscribeCouponDescription,
  SUBSCRIBE_COUPON_CODE,
  SUBSCRIBE_COUPON_PERCENT_OFF
} from "@/lib/subscribe-offer";
import type { ProductRecord, ProductReviewRecord } from "@/lib/types";

const homePageTitle = "ZenUP NAD+ and NMN Supplements for Daily Cellular Wellness";
const homePageDescription =
  "Discover ZenUP premium NAD+ and NMN supplements designed for daily wellness, healthy aging support, and clean cellular nutrition routines.";

const formulaCards = [
  {
    eyebrow: "NAD+ Support",
    title: "Nicotinamide Riboside with CoQ10 and Resveratrol",
    description:
      "The NAD+ formula is built around Nicotinamide Riboside for shoppers who want a clearly labeled, premium daily NAD+ support routine.",
    detail:
      "CoQ10 and Resveratrol help the blend feel more complete, so the product reads like a deliberate everyday wellness formula instead of a single-ingredient capsule."
  },
  {
    eyebrow: "NMN Support",
    title: "NMN with Quercetin, Resveratrol, CoQ10, and Astaxanthin",
    description:
      "The NMN line gives shoppers a second focused option with 60ct, 90ct, and 120ct sizes for different routine lengths and value preferences.",
    detail:
      "The supporting stack keeps the page premium and easy to compare while staying grounded in compliant daily wellness and cellular wellness language."
  },
  {
    eyebrow: "ZenUP Standard",
    title: "Focused formulas, clean routines, and consumer-ready education",
    description:
      "ZenUP is moving toward a curated supplement line instead of a crowded catalog, with each product page built to explain the formula quickly.",
    detail:
      "That gives the homepage a clearer role: help shoppers choose between NAD+ and NMN, then move directly into a product page that can convert."
  }
];

const routineSteps = [
  {
    step: "01",
    title: "Choose your formula focus",
    description:
      "Start with the product story that matches your routine: Nicotinamide Riboside for NAD+ support or NMN for a premium daily cellular wellness blend."
  },
  {
    step: "02",
    title: "Keep the habit simple",
    description:
      "Each product page keeps serving format, bottle count, ingredients, and pricing close together so the decision feels calm and easy to repeat."
  },
  {
    step: "03",
    title: "Build around consistency",
    description:
      "The brand voice stays focused on daily wellness, healthy aging support, and long-term routine fit instead of exaggerated supplement claims."
  }
];

type HomeProductLineCard = {
  product: ProductRecord;
  href: string;
  eyebrow: string;
  summary: string;
  facts: string[];
  imageAlt: string;
  theme: "nad" | "nmn";
};

export const metadata: Metadata = {
  title: homePageTitle,
  description: homePageDescription,
  alternates: {
    canonical: "/"
  },
  keywords: [
    "ZenUP",
    "NAD+ supplement",
    "NMN supplement",
    "nicotinamide riboside",
    "healthy aging support",
    "cellular wellness",
    "CoQ10 and Resveratrol",
    "daily wellness supplement"
  ],
  openGraph: {
    title: `${homePageTitle} | ${siteConfig.title}`,
    description: homePageDescription,
    url: "/",
    type: "website",
    images: [
      {
        url: buildSiteImageUrl("home", "1.png"),
        width: 768,
        height: 960,
        alt: "ZenUP premium supplement homepage scene"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${homePageTitle} | ${siteConfig.title}`,
    description: homePageDescription,
    images: [buildSiteImageUrl("home", "1.png")]
  }
};

type HomePageProps = {
  searchParams: Promise<{ subscribed?: string; subscribe_error?: string }>;
};

function getProductImage(product: ProductRecord) {
  return getDefaultProductImageUrl(product.slug) ?? product.imageUrl;
}

function getReviewsForProduct(reviews: ProductReviewRecord[], productId: string) {
  return reviews.filter((review) => review.productId === productId);
}

function getAverageRating(product: ProductRecord, reviews: ProductReviewRecord[]) {
  if (reviews.length > 0) {
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }

  return product.averageRating ?? null;
}

function getReviewCount(product: ProductRecord, reviews: ProductReviewRecord[]) {
  return reviews.length || product.reviewCount || 0;
}

function getProductLineCards(nadProduct: ProductRecord | null, nmnProduct: ProductRecord | null) {
  return [
    nadProduct
      ? {
          product: nadProduct,
          href: CANONICAL_PRODUCT_PATH,
          eyebrow: "Shop NAD+",
          summary:
            "A Nicotinamide Riboside formula with CoQ10 and Resveratrol for shoppers who want a premium daily NAD+ support option.",
          facts: ["Nicotinamide Riboside", "CoQ10 + Resveratrol", "120 veggie capsules"],
          imageAlt: "ZenUP Nicotinamide Riboside NAD+ supplement bottle",
          theme: "nad" as const
        }
      : null,
    nmnProduct
      ? {
          product: nmnProduct,
          href: NMN_CANONICAL_PRODUCT_PATH,
          eyebrow: "Shop NMN",
          summary:
            "A premium NMN formula with Quercetin, Resveratrol, CoQ10, and Astaxanthin, available in multiple bottle sizes.",
          facts: ["NMN daily wellness", "60ct / 90ct / 120ct", "From $19.99"],
          imageAlt: "ZenUP NMN supplement bottle in premium packaging",
          theme: "nmn" as const
        }
      : null
  ].filter((item): item is HomeProductLineCard => Boolean(item));
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const [nadProduct, nmnProduct, posts, settings, params] = await Promise.all([
    getProductBySlug(LEGACY_PRODUCT_SLUG),
    getProductBySlug(NMN_PRIMARY_PRODUCT_SLUG),
    getPublishedPosts(3),
    getStoreSettings(),
    searchParams
  ]);

  const productLine = getProductLineCards(nadProduct, nmnProduct);
  const productIds = productLine.map((item) => item.product.id);
  const productReviews = productIds.length > 0 ? await getPublishedReviewsByProductIds(productIds) : [];
  const reviewHighlights = productReviews.slice(0, 2);
  const contact = resolveStorefrontContact(settings);
  const emailDeliveryReady = hasConfiguredEmailDelivery(settings);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.title,
        url: siteConfig.url,
        description: homePageDescription,
        ...(contact.supportEmail ? { email: contact.supportEmail } : {}),
        ...(contact.phone ? { telephone: contact.phone } : {}),
        areaServed: "US",
        image: `${siteConfig.url}${buildSiteImageUrl("home", "1.png")}`
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.title,
        description: homePageDescription,
        publisher: {
          "@id": `${siteConfig.url}/#organization`
        }
      },
      ...productLine.map((item) => ({
        "@type": "Product",
        name: item.product.name,
        description: item.product.description,
        image: [new URL(getProductImage(item.product), siteConfig.url).toString()],
        brand: {
          "@type": "Brand",
          name: siteConfig.name
        },
        offers: {
          "@type": "Offer",
          url: `${siteConfig.url}${getCanonicalProductPath(item.product.slug)}`,
          priceCurrency: item.product.currency,
          price: (item.product.priceCents / 100).toFixed(2),
          availability: "https://schema.org/InStock"
        }
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <HomeBannerSlider />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="ZenUP Formula System"
            title="Two focused supplement lines for daily cellular wellness routines."
            description="ZenUP now gives shoppers a clean choice between NAD+ and NMN support, with each formula positioned around premium ingredients, easy comparison, and everyday wellness use."
          />
          <div className="cards-3">
            {formulaCards.map((card) => (
              <article key={card.title} className="panel philosophy-card">
                <p className="eyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <p className="philosophy-card__detail">{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {productLine.length > 0 ? (
        <section className="section">
          <div className="container">
            <div className="home-flagship home-product-line">
              <div className="home-product-line__header">
                <div>
                  <p className="eyebrow">Shop ZenUP</p>
                  <h2>Choose the formula that fits your daily wellness routine.</h2>
                </div>
                <p>
                  NAD+ and NMN are now presented as two clear product paths. Each card keeps the price,
                  key ingredients, reviews, and next step close together so shoppers can move naturally
                  from discovery to purchase.
                </p>
              </div>

              <div className="home-product-line__grid">
                {productLine.map((item) => {
                  const reviews = getReviewsForProduct(productReviews, item.product.id);
                  const averageRating = getAverageRating(item.product, reviews);
                  const reviewCount = getReviewCount(item.product, reviews);
                  const savingsCents = getSavingsCents(
                    item.product.compareAtPriceCents,
                    item.product.priceCents
                  );

                  return (
                    <article
                      key={item.product.id}
                      className={`home-product-line__card home-product-line__card--${item.theme}`}
                    >
                      <Link href={item.href} className="home-product-line__media" aria-label={item.product.name}>
                        <Image
                          src={getProductImage(item.product)}
                          alt={item.imageAlt}
                          fill
                          sizes="(max-width: 720px) 100vw, (max-width: 1080px) 44vw, 28vw"
                        />
                      </Link>

                      <div className="home-product-line__copy">
                        <p className="eyebrow">{item.eyebrow}</p>
                        <h3>{item.product.name}</h3>
                        <p>{item.summary}</p>
                        <div className="home-product-line__facts">
                          {item.facts.map((fact) => (
                            <span key={fact} className="pill">
                              {fact}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="home-product-line__buy">
                        {typeof item.product.compareAtPriceCents === "number" ? (
                          <span className="home-flagship__compare">
                            {formatCurrency(item.product.compareAtPriceCents, item.product.currency)}
                          </span>
                        ) : null}
                        <div className="home-flagship__price-row">
                          <strong>{formatCurrency(item.product.priceCents, item.product.currency)}</strong>
                          {savingsCents > 0 ? (
                            <span className="pill">Save {formatCurrency(savingsCents, item.product.currency)}</span>
                          ) : null}
                        </div>
                        {typeof averageRating === "number" ? (
                          <RatingStars rating={averageRating} reviewCount={reviewCount} size="md" showCount />
                        ) : null}
                        <Link href={item.href} className="button button--primary">
                          Buy now
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="home-flagship__reviews home-product-line__reviews">
                <div className="home-flagship__reviews-intro">
                  <div className="home-flagship__reviews-header">
                    <p className="eyebrow">Customer feedback</p>
                    <h3>Early reviews help new shoppers compare the line with confidence.</h3>
                  </div>
                  <p className="home-flagship__reviews-copy">
                    The homepage now reinforces the full ZenUP line while keeping review language focused
                    on packaging, routine fit, and formula clarity.
                  </p>
                </div>

                <div className="home-flagship__review-grid">
                  {reviewHighlights.length > 0 ? (
                    reviewHighlights.map((review) => (
                      <article key={review.id} className="home-flagship__review">
                        <div className="home-flagship__review-meta">
                          <RatingStars rating={review.rating} size="sm" showValue={false} />
                          <span>{review.displayName}</span>
                        </div>
                        <h4>{review.title}</h4>
                        <p>{review.content}</p>
                      </article>
                    ))
                  ) : (
                    <article className="home-flagship__review home-flagship__review--empty">
                      <p>Customer review highlights will appear here as published feedback comes in.</p>
                    </article>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <div className="home-routine">
            <div className="home-routine__intro">
              <SectionHeading
                eyebrow="Daily Routine"
                title="A calmer supplement routine starts with a clearer product choice."
                description="The homepage introduces the line first, then lets shoppers choose the product page that fits their focus. The language stays premium, direct, and compliant."
              />
              <div className="page-hero__stats">
                <span className="pill">NAD+ support path</span>
                <span className="pill">NMN wellness path</span>
                <span className="pill">Premium daily capsules</span>
              </div>
            </div>

            <div className="home-routine__media">
              <div className="home-image home-image--landscape home-routine__image home-routine__image--primary">
                <Image
                  src={buildSiteImageUrl("home", "5.png")}
                  alt="ZenUP supplements integrated into a refined daily wellness scene"
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1080px) 80vw, 42vw"
                />
              </div>
              <div className="home-image home-image--square home-routine__image home-routine__image--secondary">
                <Image
                  src={buildSiteImageUrl("home", "6.png")}
                  alt="Close-up premium wellness campaign image for ZenUP"
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1080px) 60vw, 24vw"
                />
              </div>
            </div>

            <div className="ritual-steps ritual-steps--grid">
              {routineSteps.map((step) => (
                <article key={step.step} className="panel ritual-step">
                  <span className="ritual-step__index">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Blog"
            title="Education for shoppers comparing NAD+, NMN, and daily wellness formulas."
            description="Read practical, consumer-friendly articles that explain the category without hype-heavy claims or confusing supplement jargon."
          />
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="home-cta home-cta--image">
            <div className="home-cta__copy">
              <p className="eyebrow">ZENUP - A DR. PROOF BRAND</p>
              <h2>Premium cellular wellness supplements built for clean daily routines.</h2>
              <p>
                ZenUP is designed for customers who want focused formulas, transparent product pages,
                and a more polished way to compare NAD+ and NMN support. The line keeps the story simple:
                premium ingredients, consumer-ready education, and daily wellness routines that feel easy
                to keep using.
              </p>
              <div className="hero-actions">
                <Link href={CANONICAL_PRODUCT_PATH} className="button button--primary">
                  Shop NAD+
                </Link>
                <Link href={NMN_CANONICAL_PRODUCT_PATH} className="button button--secondary">
                  Shop NMN
                </Link>
              </div>
            </div>

            <div className="home-image home-image--portrait home-cta__visual-frame">
              <Image
                src={buildSiteImageUrl("home", "7.png")}
                alt="Final premium wellness campaign image for the ZenUP homepage"
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1080px) 70vw, 32vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="subscribe-panel">
            <div className="subscribe-panel__copy">
              <p className="eyebrow">Subscriber Welcome Offer</p>
              <h2>
                {emailDeliveryReady
                  ? `Subscribe and get ${SUBSCRIBE_COUPON_PERCENT_OFF}% off your first purchase.`
                  : "Join the ZenUP list and we will queue your launch offer."}
              </h2>
              <p>
                {emailDeliveryReady
                  ? "Join the ZenUP list for NAD+ and NMN product updates, formula education, and a welcome coupon delivered straight to your inbox."
                  : "Join the ZenUP list for NAD+ and NMN product updates and launch news. If automated email delivery is still being finalized, we will store your signup safely and activate the offer as soon as sending is live."}
              </p>
              <div className="page-hero__stats">
                <span className="pill">{SUBSCRIBE_COUPON_CODE}</span>
                <span className="pill">{getSubscribeCouponDescription()}</span>
                <span className="pill">
                  {emailDeliveryReady ? "Sent by email instantly" : "Queued until email delivery is live"}
                </span>
              </div>
            </div>

            <form action="/api/subscribe" method="post" className="subscribe-panel__form">
              <div className="field">
                <label htmlFor="subscribe-email">Email address</label>
                <input
                  id="subscribe-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button type="submit" className="button button--primary">
                {emailDeliveryReady
                  ? `Send my ${SUBSCRIBE_COUPON_PERCENT_OFF}% offer`
                  : "Join the ZenUP list"}
              </button>
              <p className="form-note">
                {emailDeliveryReady
                  ? "We will email your code so you can keep it for checkout. Please check spam or promotions if it does not arrive right away."
                  : "We will save your signup immediately. If automated email is not active yet, your request stays queued instead of getting lost."}
              </p>
            </form>
          </div>
        </div>
      </section>

      {params.subscribe_error === "email" ? (
        <div className="success-modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-error-title">
          <div className="success-modal__backdrop" />
          <div className="success-modal__panel">
            <p className="eyebrow">Subscription saved</p>
            <h2 id="subscribe-error-title">We saved your signup, but the email has not gone out yet.</h2>
            <p>
              Your subscription was recorded, but the coupon email could not be delivered right
              now. Please try again shortly or contact the team if you keep seeing this.
            </p>
            <Link href="/" className="button button--primary">
              Close
            </Link>
          </div>
        </div>
      ) : null}

      {params.subscribed === "queued" ? (
        <div className="success-modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-queued-title">
          <div className="success-modal__backdrop" />
          <div className="success-modal__panel">
            <p className="eyebrow">You are on the list</p>
            <h2 id="subscribe-queued-title">Your signup was saved while email delivery is still being finalized.</h2>
            <p>
              We recorded your request successfully. The welcome offer is queued and can be sent
              once automated email delivery is enabled for the store.
            </p>
            <Link href="/" className="button button--primary">
              Continue browsing
            </Link>
          </div>
        </div>
      ) : null}

      {params.subscribed === "1" ? (
        <div className="success-modal" role="dialog" aria-modal="true" aria-labelledby="subscribe-success-title">
          <div className="success-modal__backdrop" />
          <div className="success-modal__panel">
            <p className="eyebrow">Check your inbox</p>
            <h2 id="subscribe-success-title">Your welcome offer is on the way.</h2>
            <p>
              We just sent {SUBSCRIBE_COUPON_CODE} to your email. Please check your inbox, and if
              you do not see it in a minute or two, take a quick look in spam or promotions.
            </p>
            <Link href="/" className="button button--primary">
              Continue browsing
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
