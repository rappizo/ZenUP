import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeBannerSlider } from "@/components/home/home-banner-slider";
import { SocialProofSlider } from "@/components/home/social-proof-slider";
import { PostCard } from "@/components/ui/post-card";
import { RatingStars } from "@/components/ui/rating-stars";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatCurrency, getSavingsCents } from "@/lib/format";
import {
  getFeaturedProducts,
  getPublishedPosts,
  getPublishedReviewsByProductId,
  getStoreSettings
} from "@/lib/queries";
import { hasConfiguredEmailDelivery, resolveStorefrontContact, siteConfig } from "@/lib/site-config";
import { buildSiteImageUrl } from "@/lib/site-media";
import {
  getSubscribeCouponDescription,
  SUBSCRIBE_COUPON_CODE,
  SUBSCRIBE_COUPON_PERCENT_OFF
} from "@/lib/subscribe-offer";

const homePageTitle = "Professional NAD+ Nutrition for Cellular Energy and Healthy Aging";
const homePageDescription =
  "Discover ZenUP, a professional NAD+ supplement brand centered on Nicotinamide Riboside, Quercetin Phytosome, Resveratrol, and CoQ10.";

const formulaCards = [
  {
    eyebrow: "Core NAD+ Support",
    title: "600mg Nicotinamide Riboside Hydrogen Malate",
    description:
      "A serious daily serving level that leads the page with the ingredient most NAD+ shoppers already compare first."
  },
  {
    eyebrow: "Amplifier",
    title: "250mg Quercetin Phytosome",
    description:
      "Included to strengthen the healthy-aging position and make the formula feel more complete than a single-ingredient NR bottle."
  },
  {
    eyebrow: "Longevity Companion",
    title: "150mg Trans-Resveratrol + 100mg CoQ10",
    description:
      "Two supporting ingredients that round out the daily-use story for customers who want a stronger all-in-one stack."
  }
];

const flagshipChecklist = [
  "Serving size: 2 veggie capsules",
  "120 capsules per bottle / 60 servings",
  "Quercetin Phytosome, Resveratrol, and CoQ10 included",
  "Built for daily routine consistency, not supplement clutter",
  "Designed as a one-bottle NAD+ support routine instead of a fragmented stack"
];

const flagshipFormulaFacts = [
  {
    value: "600mg",
    label: "Nicotinamide Riboside Hydrogen Malate"
  },
  {
    value: "250mg",
    label: "Quercetin Phytosome"
  },
  {
    value: "150mg",
    label: "Trans-Resveratrol"
  },
  {
    value: "100mg",
    label: "Coenzyme Q10"
  }
];

const flagshipBenefits = [
  {
    title: "Single-product focus",
    description:
      "The storefront is built around one flagship SKU, so the message stays clean and the buyer journey feels decisive."
  },
  {
    title: "Premium formula logic",
    description:
      "The ingredient story leads with NR strength, then reinforces the formula with companion ingredients that feel deliberate."
  },
  {
    title: "Designed to convert",
    description:
      "Price, reviews, formula details, and purchase action now sit together in one stronger flagship block."
  }
];

const routineSteps = [
  {
    step: "01",
    title: "Take 2 capsules daily",
    description:
      "The dosage is easy to understand, which makes the formula feel more trustworthy and much easier to stick with."
  },
  {
    step: "02",
    title: "Keep one bottle in rotation",
    description:
      "ZenUP is positioned as the anchor of the routine so customers do not need to juggle multiple bottles to feel complete."
  },
  {
    step: "03",
    title: "Stay consistent long term",
    description:
      "The brand tone is built around steady daily use and healthy-aging support instead of hype-heavy short-term promises."
  }
];

export const metadata: Metadata = {
  title: homePageTitle,
  description: homePageDescription,
  alternates: {
    canonical: "/"
  },
  keywords: [
    "ZenUP",
    "NAD+ supplement",
    "nicotinamide riboside",
    "healthy aging supplement",
    "quercetin phytosome",
    "resveratrol coq10 formula"
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
        alt: "ZenUP NAD+ supplement hero scene"
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

export default async function HomePage({ searchParams }: HomePageProps) {
  const [products, posts, settings, params] = await Promise.all([
    getFeaturedProducts(1),
    getPublishedPosts(3),
    getStoreSettings(),
    searchParams
  ]);

  const featuredProduct = products[0] ?? null;
  const productReviews = featuredProduct ? await getPublishedReviewsByProductId(featuredProduct.id) : [];
  const reviewHighlights = productReviews.slice(0, 2);
  const reviewCount = productReviews.length || featuredProduct?.reviewCount || 0;
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : featuredProduct?.averageRating ?? null;
  const savingsCents =
    featuredProduct ? getSavingsCents(featuredProduct.compareAtPriceCents, featuredProduct.priceCents) : 0;
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
      ...(featuredProduct
        ? [
            {
              "@type": "Product",
              name: featuredProduct.name,
              description: featuredProduct.description,
              image: [new URL(featuredProduct.imageUrl, siteConfig.url).toString()],
              brand: {
                "@type": "Brand",
                name: siteConfig.name
              },
              offers: {
                "@type": "Offer",
                url: `${siteConfig.url}/shop/${featuredProduct.slug}`,
                priceCurrency: featuredProduct.currency,
                price: (featuredProduct.priceCents / 100).toFixed(2),
                availability: "https://schema.org/InStock"
              }
            }
          ]
        : [])
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
            eyebrow="Formula Breakdown"
            title="Built around the ingredients the NAD+ customer already knows to compare."
            description="The homepage now leads with formula clarity, dosage transparency, and a cleaner premium presentation."
          />
          <div className="cards-3">
            {formulaCards.map((card) => (
              <article key={card.title} className="panel philosophy-card">
                <p className="eyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {featuredProduct ? (
        <section className="section">
          <div className="container">
            <div className="home-flagship">
              <div className="home-flagship__main">
                <div className="home-flagship__media">
                  <div className="home-image home-image--portrait home-flagship__image">
                    <Image
                      src={buildSiteImageUrl("home", "3.png")}
                      alt="ZenUP flagship NAD+ product in a premium campaign scene."
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1080px) 56vw, 34vw"
                    />
                  </div>

                  <article className="panel home-flagship__formula">
                    <p className="eyebrow">Flagship formula snapshot</p>
                    <p className="home-flagship__formula-lead">
                      A premium daily NR-centered formula built to feel complete on its own, with
                      clear serving logic and supporting ingredients that strengthen the healthy-aging story.
                    </p>
                    <ul className="home-flagship__list">
                      {flagshipChecklist.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="home-flagship__fact-grid">
                      {flagshipFormulaFacts.map((fact) => (
                        <div key={fact.label} className="home-flagship__fact">
                          <strong>{fact.value}</strong>
                          <span>{fact.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="home-flagship__formula-note">
                      The formula is positioned for customers who want one decisive NAD+ product page with
                      transparent ingredient amounts, stronger perceived value, and less routine clutter.
                    </p>
                  </article>
                </div>

                <div className="home-flagship__content">
                  <p className="eyebrow">Flagship Product</p>
                  <h2>{featuredProduct.name}</h2>
                  <p className="home-flagship__lead">{featuredProduct.description}</p>

                  {typeof averageRating === "number" ? (
                    <RatingStars
                      rating={averageRating}
                      reviewCount={reviewCount}
                      size="md"
                      showCount
                    />
                  ) : null}

                  <div className="home-flagship__pricing">
                    {typeof featuredProduct.compareAtPriceCents === "number" ? (
                      <span className="home-flagship__compare">
                        {formatCurrency(featuredProduct.compareAtPriceCents, featuredProduct.currency)}
                      </span>
                    ) : null}
                    <div className="home-flagship__price-row">
                      <strong>{formatCurrency(featuredProduct.priceCents, featuredProduct.currency)}</strong>
                      {savingsCents > 0 ? (
                        <span className="pill">
                          Save {formatCurrency(savingsCents, featuredProduct.currency)}
                        </span>
                      ) : null}
                    </div>
                    <p className="home-flagship__price-note">
                      120 veggie capsules, 60 servings, and {featuredProduct.pointsReward} reward points
                      on every bottle.
                    </p>
                  </div>

                  <div className="cards-3 home-flagship__benefits">
                    {flagshipBenefits.map((benefit) => (
                      <article key={benefit.title} className="panel philosophy-card">
                        <h3>{benefit.title}</h3>
                        <p>{benefit.description}</p>
                      </article>
                    ))}
                  </div>

                  <div className="hero-actions">
                    <Link href={`/shop/${featuredProduct.slug}`} className="button button--primary">
                      Buy now
                    </Link>
                    <Link href={`/shop/${featuredProduct.slug}`} className="button button--secondary">
                      View full product page
                    </Link>
                  </div>
                </div>
              </div>

              <div className="home-flagship__reviews">
                <div className="home-flagship__reviews-intro">
                  <div className="home-flagship__reviews-header">
                    <p className="eyebrow">Customer feedback</p>
                    <h3>Early reviews already reinforce the premium formula story.</h3>
                  </div>
                  <p className="home-flagship__reviews-copy">
                    The review section now works like proof, not filler. It gives the customer a fast
                    confidence signal around formula completeness, premium presentation, and day-to-day usability.
                  </p>
                  {typeof averageRating === "number" ? (
                    <RatingStars
                      rating={averageRating}
                      reviewCount={reviewCount}
                      size="md"
                      showCount
                    />
                  ) : null}
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
                      <p>
                        Customer review highlights will appear here as published feedback comes in.
                      </p>
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
          <SocialProofSlider />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="home-routine">
            <div className="home-routine__intro">
              <SectionHeading
                eyebrow="Daily Use"
                title="A flagship product story that feels calm, premium, and easy to understand."
                description="Because there is only one product, the homepage can focus on clear usage, stronger proof, and a more natural buying journey."
              />
              <div className="page-hero__stats">
                <span className="pill">Straightforward daily serving</span>
                <span className="pill">Professional premium presentation</span>
                <span className="pill">Built for long-term routine use</span>
              </div>
            </div>

            <div className="home-routine__media">
              <div className="home-image home-image--landscape home-routine__image home-routine__image--primary">
                <Image
                  src={buildSiteImageUrl("home", "5.png")}
                  alt="ZenUP supplement integrated into a refined daily wellness scene."
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1080px) 80vw, 42vw"
                />
              </div>
              <div className="home-image home-image--square home-routine__image home-routine__image--secondary">
                <Image
                  src={buildSiteImageUrl("home", "6.png")}
                  alt="Close-up campaign image for the ZenUP supplement routine."
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
            title="Educational content rewritten for a professional supplement audience."
            description="The article library now supports NAD+, Nicotinamide Riboside, formula comparison, and routine-building instead of skincare topics."
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
              <p className="eyebrow">Next Step</p>
              <h2>The homepage now reads like a premium one-product brand instead of a generic catalog.</h2>
              <p>
                ZenUP now has a clearer flagship story, stronger visual rhythm, and a more focused
                path from brand introduction to product purchase.
              </p>
              <div className="hero-actions">
                <Link href="/shop/zenup-nad-plus-nicotinamide-riboside" className="button button--primary">
                  Shop ZenUP NAD+
                </Link>
                <Link href="/contact" className="button button--secondary">
                  Contact the team
                </Link>
              </div>
            </div>

            <div className="home-image home-image--portrait home-cta__visual-frame">
              <Image
                src={buildSiteImageUrl("home", "7.png")}
                alt="Final premium campaign image for the ZenUP homepage call to action."
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
                  ? "Join the ZenUP list for NAD+ product updates, formula education, and a welcome coupon delivered straight to your inbox."
                  : "Join the ZenUP list for NAD+ product updates and launch news. If automated email delivery is still being finalized, we will store your signup safely and activate the offer as soon as sending is live."}
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
