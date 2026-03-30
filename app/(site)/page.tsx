import type { Metadata } from "next";
import Link from "next/link";
import { HomeBannerSlider } from "@/components/home/home-banner-slider";
import { SocialProofSlider } from "@/components/home/social-proof-slider";
import { ImagePromptPlaceholder } from "@/components/ui/image-prompt-placeholder";
import { PostCard } from "@/components/ui/post-card";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { homeVisualPrompts } from "@/lib/home-visual-prompts";
import { getFeaturedProducts, getPublishedPosts } from "@/lib/queries";
import { siteConfig } from "@/lib/site-config";
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
      "A serious daily serving level for customers who want the formula anchored by a recognized NAD+ precursor."
  },
  {
    eyebrow: "Amplifier",
    title: "250mg Quercetin Phytosome",
    description:
      "Included to strengthen the healthy-aging positioning and create a more complete stack in one bottle."
  },
  {
    eyebrow: "Longevity Companion",
    title: "150mg Trans-Resveratrol + 100mg CoQ10",
    description:
      "Resveratrol and CoQ10 round out the formula for customers looking beyond single-ingredient NR products."
  }
];

const routineSteps = [
  {
    step: "01",
    title: "Take 2 capsules daily",
    description:
      "The routine is simple by design so customers can stay consistent instead of managing a complicated stack."
  },
  {
    step: "02",
    title: "Use it as the anchor product",
    description:
      "ZenUP is built to cover the core ingredients most NAD+ shoppers already want in one place."
  },
  {
    step: "03",
    title: "Stay with the routine",
    description:
      "This site is positioned around steady, professional daily use rather than short-term hype or cluttered messaging."
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
        url: buildSiteImageUrl("home", "ZenUP Hero Main.png"),
        width: 768,
        height: 768,
        alt: "ZenUP NAD+ bottle"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${homePageTitle} | ${siteConfig.title}`,
    description: homePageDescription,
    images: [buildSiteImageUrl("home", "ZenUP Hero Main.png")]
  }
};

type HomePageProps = {
  searchParams: Promise<{ subscribed?: string; subscribe_error?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [products, posts, params] = await Promise.all([
    getFeaturedProducts(1),
    getPublishedPosts(3),
    searchParams
  ]);

  const featuredProduct = products[0];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.title,
        url: siteConfig.url,
        description: homePageDescription,
        email: siteConfig.supportEmail,
        telephone: siteConfig.phone,
        areaServed: "US",
        image: `${siteConfig.url}${buildSiteImageUrl("home", "ZenUP Hero Main.png")}`
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
          <div className="brand-manifesto">
            <div className="brand-manifesto__copy">
              <p className="eyebrow">ZenUP Brand Positioning</p>
              <h1 className="brand-manifesto__title">
                One flagship NAD+ product. Clear formula logic. Professional presentation.
              </h1>
              <p className="brand-manifesto__lead">
                ZenUP is built around a single hero product so the story stays focused: a premium
                daily supplement for shoppers who care about NAD+ support, healthy aging, and a
                cleaner long-term routine.
              </p>
              <div className="brand-manifesto__pills">
                <span className="pill">120 veggie capsules</span>
                <span className="pill">60 servings per bottle</span>
                <span className="pill">United States shipping</span>
              </div>
              <p className="brand-manifesto__note">
                The site has been restructured to sell one product well before expanding the
                catalog, and the homepage image slots now double as direct prompt briefs so you
                can generate custom ZenUP campaign assets without redesigning the layout.
              </p>
              <div className="hero-actions">
                <Link href="/shop/zenup-nad-plus-nicotinamide-riboside" className="button button--primary">
                  View product
                </Link>
                <Link href="/blog" className="button button--secondary">
                  Explore the blog
                </Link>
              </div>
            </div>

            <ImagePromptPlaceholder
              {...homeVisualPrompts.brandStory}
              className="brand-manifesto__visual"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Formula Breakdown"
            title="Built around the ingredients the NAD+ customer already knows to compare."
            description="The homepage now leads with formula clarity so the product feels credible before the customer ever reaches the cart."
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
            <SectionHeading
              eyebrow="Flagship Product"
              title="The storefront is now focused on a single high-priority landing product."
              description="This keeps the catalog lean while you prepare more detailed assets and higher-converting landing page content."
            />
            <div className="product-grid product-grid--single">
              <ProductCard product={featuredProduct} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Why This Setup Works"
            title="The ingredient panel is now part of the hero story instead of hidden secondary content."
            description="For a supplement brand, formula transparency and daily-use clarity need to show up earlier than generic brand lifestyle messaging."
          />
          <SocialProofSlider />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ritual-spotlight">
            <div className="ritual-spotlight__hero">
              <div className="ritual-spotlight__content">
                <SectionHeading
                  eyebrow="Daily Use"
                  title="A simple three-step message customers can understand in seconds."
                  description="The product story now emphasizes dosage clarity, consistency, and a more professional healthy-aging routine."
                />
              </div>
              <div className="ritual-spotlight__media">
                <ImagePromptPlaceholder {...homeVisualPrompts.routineScene} className="ritual-prompt" />
                <ImagePromptPlaceholder {...homeVisualPrompts.ingredientMacro} className="ritual-prompt" />
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
          <div className="home-cta">
            <div className="home-cta__copy">
              <p className="eyebrow">Next Step</p>
              <h2>ZenUP is ready to sell one product cleanly before you expand the catalog.</h2>
              <p>
                The homepage, product story, blog, and visual system now all reinforce the same
                positioning: premium NAD+ supplementation with a focused, ingredient-led message.
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

            <ImagePromptPlaceholder {...homeVisualPrompts.ctaBanner} className="home-cta__visual" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="subscribe-panel">
            <div className="subscribe-panel__copy">
              <p className="eyebrow">Subscriber Welcome Offer</p>
              <h2>Subscribe and get {SUBSCRIBE_COUPON_PERCENT_OFF}% off your first purchase.</h2>
              <p>
                Join the ZenUP list for NAD+ product updates, formula education, and a welcome
                coupon delivered straight to your inbox.
              </p>
              <div className="page-hero__stats">
                <span className="pill">{SUBSCRIBE_COUPON_CODE}</span>
                <span className="pill">{getSubscribeCouponDescription()}</span>
                <span className="pill">Sent by email instantly</span>
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
                Send my {SUBSCRIBE_COUPON_PERCENT_OFF}% offer
              </button>
              <p className="form-note">
                We will email your code so you can keep it for checkout. Please check spam or
                promotions if it does not arrive right away.
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
