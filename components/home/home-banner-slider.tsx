import Image from "next/image";
import Link from "next/link";
import { NMN_CANONICAL_PRODUCT_PATH } from "@/lib/nmn-product";
import { CANONICAL_PRODUCT_PATH } from "@/lib/product-landing";
import { buildSiteImageUrl } from "@/lib/site-media";

const heroStats = [
  {
    value: "NAD+",
    label: "nicotinamide riboside formula"
  },
  {
    value: "NMN",
    label: "premium daily wellness line"
  },
  {
    value: "Daily",
    label: "clean supplement routines"
  }
];

export function HomeBannerSlider() {
  return (
    <section className="section home-banner">
      <div className="container">
        <div className="home-hero">
          <div className="home-hero__content">
            <p className="eyebrow">Premium Cellular Wellness</p>
            <h1>NAD+ and NMN supplements built for disciplined daily routines.</h1>
            <p>
              ZenUP brings together two focused supplement paths: Nicotinamide Riboside for daily NAD+
              support and NMN formulas with premium supporting ingredients for cellular wellness routines.
            </p>
            <div className="home-hero__facts">
              <span className="pill">NAD+ support</span>
              <span className="pill">NMN daily wellness</span>
              <span className="pill">Premium veggie capsules</span>
            </div>
            <div className="hero-actions">
              <Link href={CANONICAL_PRODUCT_PATH} className="button button--primary">
                Shop NAD+
              </Link>
              <Link href={NMN_CANONICAL_PRODUCT_PATH} className="button button--secondary">
                Shop NMN
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
                alt="ZenUP premium supplement presented in an editorial wellness scene."
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
