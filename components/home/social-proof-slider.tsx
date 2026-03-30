import { ImagePromptPlaceholder } from "@/components/ui/image-prompt-placeholder";
import { homeVisualPrompts } from "@/lib/home-visual-prompts";

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
    <div className="social-proof social-proof--zenup">
      <div className="social-proof__copy">
        <p className="eyebrow">Formula architecture</p>
        <h3>One flagship product, built around the ingredients serious shoppers actually look for.</h3>
        <p>
          ZenUP is positioned as a focused NAD+ brand, not a broad supplement catalog. The site is
          designed to make the formula, dosage, and daily-use story easy to understand at a glance.
        </p>
        <div className="cards-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="panel philosophy-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="social-proof__player">
        <div className="social-proof__embed social-proof__embed--prompt">
          <ImagePromptPlaceholder {...homeVisualPrompts.formulaBoard} className="social-proof__prompt" />
        </div>
        <div className="social-proof__meta">
          <strong>Label transparency</strong>
          <h4>600mg NR HM, 250mg Quercetin Phytosome, 150mg Resveratrol, 100mg CoQ10</h4>
          <p>
            The ingredient panel is part of the sales story, so we surface it early and treat it
            like proof, not fine print.
          </p>
        </div>
      </div>
    </div>
  );
}
