import Image from "next/image";
import Link from "next/link";
import { buildSiteImageUrl } from "@/lib/site-media";

const heroStats = [
  {
    value: "1100mg",
    label: "total active formula blend"
  },
  {
    value: "60",
    label: "daily servings per bottle"
  },
  {
    value: "4-part",
    label: "NAD+ support stack"
  }
];

export function HomeBannerSlider() {
  return (
    <section className="section home-banner">
      <div className="container">
        <div className="home-hero">
          <div className="home-hero__content">
            <p className="eyebrow">Professional NAD+ Formula</p>
            <h1>One premium NAD+ formula built for daily cellular energy support.</h1>
            <p>
              ZenUP centers on one flagship Nicotinamide Riboside formula with Quercetin, Resveratrol,
              and CoQ10 already included, so shoppers can move quickly from learning to purchasing.
            </p>
            <div className="home-hero__facts">
              <span className="pill">600mg NR Hydrogen Malate</span>
              <span className="pill">Quercetin + Resveratrol + CoQ10</span>
              <span className="pill">120 veggie capsules</span>
            </div>
            <div className="hero-actions">
              <Link href="/shop/zenup-nad-plus-nicotinamide-riboside" className="button button--primary">
                Shop ZenUP NAD+
              </Link>
              <Link href="/blog" className="button button--secondary">
                Explore NAD+ Articles
              </Link>
            </div>
            <div className="home-hero__stats">
              {heroStats.map((stat) => (
                <article key={stat.label} className="home-hero__stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="home-hero__visuals">
            <div className="home-image home-image--portrait home-hero__visual home-hero__visual--primary">
              <Image
                src={buildSiteImageUrl("home", "1.png")}
                alt="ZenUP NAD+ supplement presented in a premium editorial scene."
                fill
                priority
                sizes="(max-width: 720px) 100vw, (max-width: 1080px) 55vw, 36vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
