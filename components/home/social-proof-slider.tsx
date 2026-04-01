import Image from "next/image";
import { buildSiteImageUrl } from "@/lib/site-media";

const pillars = [
  {
    title: "NAD+ pathway support",
    body:
      "Nicotinamide Riboside Hydrogen Malate sits at the center of the formula for customers who want a dedicated NAD+ daily product.",
    detail:
      "That makes the bottle easier to compare because the core ingredient is not hidden behind vague positioning or a crowded multi-product catalog."
  },
  {
    title: "Supporting stack built in",
    body:
      "Quercetin Phytosome, Trans-Resveratrol, and CoQ10 round out the formula so the routine feels complete instead of fragmented.",
    detail:
      "For shoppers who were already considering separate add-ons, that built-in structure creates a stronger one-bottle value story and a cleaner daily routine."
  },
  {
    title: "Clear, professional label",
    body:
      "60 servings, transparent supplement facts, and a straightforward serving size make the product easier to evaluate and easier to keep using.",
    detail:
      "The presentation feels more serious because the customer can understand dosage, bottle length, and formula logic without extra guesswork."
  }
];

const formulaSupportPoints = [
  {
    title: "Clear formula hierarchy",
    body:
      "The lead ingredient appears first, the supporting stack is clearly framed, and the overall story reads like one planned formula instead of a loose assortment of ingredients."
  },
  {
    title: "Routine-friendly positioning",
    body:
      "The page explains why the bottle belongs in a long-term daily rotation, which helps the section feel fuller, more premium, and more credible to a serious supplement buyer."
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
          <p>
            That matters because premium supplement buyers usually compare more than one detail at once:
            they want to see the NR amount, the supporting ingredients, the serving count, and the overall
            routine logic without feeling like they are piecing the product together on their own.
          </p>
          <div className="home-proof__support-grid">
            {formulaSupportPoints.map((point) => (
              <article key={point.title} className="home-proof__support-card">
                <h4>{point.title}</h4>
                <p>{point.body}</p>
              </article>
            ))}
          </div>
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
              <p className="home-proof__card-detail">{pillar.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
