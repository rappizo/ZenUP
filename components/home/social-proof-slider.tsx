import Image from "next/image";
import { buildSiteImageUrl } from "@/lib/site-media";

const pillars = [
  {
    title: "NAD+ pathway support",
    body:
      "Nicotinamide Riboside Hydrogen Malate sits at the center of the formula for customers who want a dedicated NAD+ daily product."
  },
  {
    title: "Supporting stack built in",
    body:
      "Quercetin Phytosome, Trans-Resveratrol, and CoQ10 round out the formula so the routine feels complete instead of fragmented."
  },
  {
    title: "Clear, professional label",
    body:
      "60 servings, transparent supplement facts, and a straightforward serving size make the product easier to evaluate and easier to keep using."
  }
];

export function SocialProofSlider() {
  return (
    <div className="home-proof">
      <div className="home-proof__hero">
        <div className="home-proof__copy">
          <p className="eyebrow">Formula architecture</p>
          <h3>One flagship product, built around the ingredients serious shoppers actually look for.</h3>
          <p>
            ZenUP is positioned as a focused NAD+ brand, not a broad supplement catalog. The site is
            designed to make the formula, dosage, and daily-use story easy to understand at a glance.
          </p>
        </div>

        <div className="home-image home-image--square home-proof__image">
          <Image
            src={buildSiteImageUrl("home", "4.png")}
            alt="ZenUP supplement and formula positioning scene."
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1080px) 70vw, 34vw"
          />
        </div>
      </div>

      <div className="home-proof__cards">
        <div className="cards-3 home-proof__card-grid">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="panel philosophy-card home-proof__card">
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
