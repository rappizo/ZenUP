import Link from "next/link";
import { HomeBannerSlider } from "@/components/home/home-banner-slider";
import { SocialProofSlider } from "@/components/home/social-proof-slider";
import { ImagePromptPlaceholder } from "@/components/ui/image-prompt-placeholder";
import { PostCard } from "@/components/ui/post-card";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProducts, getPublishedPosts } from "@/lib/queries";

const brandPillars = [
  {
    eyebrow: "Clinical Calm",
    title: "Formulas that feel polished, soothing, and easy to stay loyal to.",
    description:
      "Neatique focuses on modern skin rituals that help daily care feel refined instead of complicated."
  },
  {
    eyebrow: "Elegant Textures",
    title: "Every layer is meant to look beautiful on the skin and under makeup.",
    description:
      "Serums absorb with a smooth finish, while creams bring comfort without taking away that fresh glow."
  },
  {
    eyebrow: "Routine First",
    title: "A collection built for real mornings, long days, and calm evening resets.",
    description:
      "The line is designed so women can mix and match according to season, mood, and skin needs."
  }
];

const routineSteps = [
  {
    step: "01",
    title: "Prep with a light hydration layer",
    description:
      "Start with a fluid serum texture that wakes the skin up and helps the rest of the ritual layer beautifully."
  },
  {
    step: "02",
    title: "Choose your focus",
    description:
      "Reach for PDRN when you want bounce and refined glow, or Snail Mucin when the skin needs soft, dewy comfort."
  },
  {
    step: "03",
    title: "Seal in comfort",
    description:
      "Finish with a cream that keeps the routine feeling plush, calm, and easy to wear from day to night."
  }
];

const ingredientStories = [
  {
    eyebrow: "PDRN Ritual",
    title: "For smooth-looking, glow-forward skin that still feels effortless.",
    description:
      "Our PDRN formulas are made for women who want their skin to look polished, rested, and quietly luminous in daily life.",
    promptTitle: "PDRN Editorial Still Life",
    prompt:
      "Luxury skincare still life, soft coral and ivory set, elegant serum bottle and cream jar, glossy reflections, clean beauty editorial lighting, modern feminine atmosphere, high-end ecommerce campaign, no text"
  },
  {
    eyebrow: "Snail Mucin Ritual",
    title: "For soft, comforted skin with a healthy dewy finish.",
    description:
      "The Snail Mucin duo is designed for routines that need replenishing hydration, bounce, and a more cushioned skin feel.",
    promptTitle: "Snail Mucin Texture Story",
    prompt:
      "Premium skincare campaign image, translucent gel texture, cream swirl, warm peach backdrop, glossy hydration mood, feminine minimal set design, clean editorial beauty photography, no text"
  }
];

const galleryPrompts = [
  {
    title: "Morning Vanity Scene",
    prompt:
      "Bright luxury bathroom vanity, skincare lineup styled with flowers and marble tray, warm morning sunlight, premium feminine beauty brand mood, clean editorial composition, no text",
    aspect: "portrait" as const
  },
  {
    title: "Texture Close-Up",
    prompt:
      "Macro beauty texture shot, silky serum drop and rich cream swatch, glossy lighting, peach and nude palette, premium skincare campaign, no text",
    aspect: "square" as const
  },
  {
    title: "Brand Lifestyle Moment",
    prompt:
      "Elegant woman applying skincare in soft natural light, refined self-care ritual, premium clean beauty campaign, warm coral styling, aspirational but realistic, no text",
    aspect: "portrait" as const
  }
];

export default async function HomePage() {
  const [products, posts] = await Promise.all([getFeaturedProducts(4), getPublishedPosts(2)]);

  return (
    <>
      <HomeBannerSlider />

      <section className="section">
        <div className="container">
          <div className="brand-manifesto">
            <div className="brand-manifesto__copy">
              <SectionHeading
                eyebrow="The Neatique Mood"
                title="Skincare that feels elegant on the shelf, beautiful on the skin, and easy to keep using."
                description="Neatique is built around modern rituals for women who want visible glow, comfort, and polish without a routine that feels overwhelming."
              />
              <div className="brand-manifesto__pills">
                <span className="pill">United States shipping</span>
                <span className="pill">Daily serum and cream rituals</span>
                <span className="pill">Glow, comfort, and texture care</span>
              </div>
              <p className="brand-manifesto__note">
                From first texture to final finish, the brand direction is simple: products should
                feel elevated, look refined, and fit naturally into a routine women actually enjoy.
              </p>
              <div className="hero-actions">
                <Link href="/shop" className="button button--primary">
                  Shop the collection
                </Link>
                <Link href="/contact" className="button button--secondary">
                  Talk to Neatique
                </Link>
              </div>
            </div>

            <ImagePromptPlaceholder
              label="Hero Visual Prompt"
              title="Signature Brand Campaign"
              prompt="Luxury skincare campaign image, soft coral and cream palette, premium glass bottles and cream jars, warm sunlight, sculptural shadows, feminine editorial styling, ecommerce homepage hero, no text"
              aspect="portrait"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Signature Collection"
            title="Meet the four Neatique essentials at the heart of the collection."
            description="Each formula is designed to feel elegant, easy to use, and beautiful in a daily routine from morning prep to evening wind-down."
          />
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="philosophy-band">
            <div className="philosophy-band__intro">
              <p className="eyebrow">Brand Philosophy</p>
              <h2>High-touch skincare without the clutter.</h2>
              <p>
                The collection is shaped around a brighter kind of luxury: clean styling, warm
                femininity, and formulas that make the skin look quietly more polished over time.
              </p>
            </div>

            <div className="philosophy-band__grid">
              {brandPillars.map((pillar) => (
                <article key={pillar.eyebrow} className="panel philosophy-card">
                  <p className="eyebrow">{pillar.eyebrow}</p>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ritual-spotlight">
            <div className="ritual-spotlight__media">
              <ImagePromptPlaceholder
                label="Routine Prompt"
                title="Refined Sink-Side Ritual"
                prompt="Editorial beauty scene with premium skincare lined beside a sink, soft morning light, warm nude and coral palette, elevated minimalist bathroom styling, high-end skincare brand campaign, no text"
                aspect="portrait"
              />
              <ImagePromptPlaceholder
                label="Texture Prompt"
                title="Application Close-Up"
                prompt="Beauty close-up of serum pressed into skin, luminous complexion, soft focus premium skincare campaign, natural feminine elegance, coral-beige tones, no text"
                aspect="square"
              />
            </div>

            <div className="ritual-spotlight__content">
              <SectionHeading
                eyebrow="Designed For Daily Rituals"
                title="A three-step approach that keeps skincare feeling clear, consistent, and luxurious."
                description="Neatique is made for women who want a routine that fits real life while still feeling like a small personal ritual."
              />
              <div className="ritual-steps">
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Loved Online"
            title="Creator-led moments that help new shoppers trust the texture, finish, and glow."
            description="Watch creators share the feel of the formulas, then move into the products that match the ritual you want to build."
          />
          <SocialProofSlider />
        </div>
      </section>

      <section className="section">
        <div className="container ingredient-story-grid">
          {ingredientStories.map((story) => (
            <article key={story.eyebrow} className="ingredient-story panel">
              <ImagePromptPlaceholder
                label="Editorial Prompt"
                title={story.promptTitle}
                prompt={story.prompt}
                aspect="landscape"
              />
              <div className="ingredient-story__copy">
                <p className="eyebrow">{story.eyebrow}</p>
                <h3>{story.title}</h3>
                <p>{story.description}</p>
                <Link href="/shop" className="link-inline">
                  Explore the shop
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Visual Direction"
            title="A richer homepage experience, ready for your final campaign images."
            description="These image slots are left as prompt-based placeholders so you can generate or shoot visuals later without changing the page structure."
          />
          <div className="editorial-prompt-grid">
            {galleryPrompts.map((item) => (
              <ImagePromptPlaceholder
                key={item.title}
                label="Replace Later"
                title={item.title}
                prompt={item.prompt}
                aspect={item.aspect}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Beauty Tips"
            title="Simple reads to help women build a routine that feels clear, easy, and enjoyable."
            description="Explore ingredient stories, layering tips, and everyday skincare guidance made to feel approachable and useful."
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
              <p className="eyebrow">Ready For Your Ritual</p>
              <h1>Find the serum and cream pairing that makes your routine feel softer, brighter, and more elevated.</h1>
              <p>
                Explore the collection, save your favorite formulas, and build a skincare ritual
                that feels both luxurious and easy to stay committed to.
              </p>
              <div className="hero-actions">
                <Link href="/shop" className="button button--primary">
                  Shop Neatique
                </Link>
                <Link href="/beauty-tips" className="button button--secondary">
                  Read Beauty Tips
                </Link>
              </div>
            </div>

            <ImagePromptPlaceholder
              label="Closing Visual Prompt"
              title="Soft Evening Brand Moment"
              prompt="Luxury skincare campaign closing image, warm sunset light on vanity, premium cream and serum hero arrangement, feminine calm self-care mood, coral and ivory palette, ecommerce brand storytelling, no text"
              aspect="landscape"
            />
          </div>
        </div>
      </section>
    </>
  );
}
