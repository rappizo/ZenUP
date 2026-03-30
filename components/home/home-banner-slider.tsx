import Link from "next/link";
import { ImagePromptPlaceholder } from "@/components/ui/image-prompt-placeholder";
import { homeVisualPrompts } from "@/lib/home-visual-prompts";

const highlights = [
  "600mg Nicotinamide Riboside Hydrogen Malate",
  "250mg Quercetin Phytosome",
  "150mg Trans-Resveratrol + 100mg CoQ10"
];

export function HomeBannerSlider() {
  return (
    <section className="home-banner">
      <div className="container">
        <div className="custom-slider-container custom-slider-container--zenup">
          <div className="custom-slide custom-slide--zenup">
            <div className="slide-part text-part">
              <div className="text-content">
                <p className="eyebrow">ZenUP NAD+ System</p>
                <h3>Professional NAD+ nutrition built for consistent daily use.</h3>
                <p>
                  ZenUP combines Nicotinamide Riboside with Quercetin Phytosome,
                  Trans-Resveratrol, and CoQ10 in one clean 120-capsule formula for customers
                  building a serious healthy-aging routine.
                </p>
                <div className="hero-copy__badges">
                  {highlights.map((item) => (
                    <span key={item} className="pill">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="hero-actions">
                  <Link href="/shop/zenup-nad-plus-nicotinamide-riboside" className="button button--primary">
                    Shop ZenUP NAD+
                  </Link>
                  <Link href="/blog" className="button button--secondary">
                    Read the blog
                  </Link>
                </div>
              </div>
            </div>

            <div className="slide-part image-part middle-img">
              <ImagePromptPlaceholder {...homeVisualPrompts.bannerHero} className="home-banner__prompt" />
            </div>

            <div className="slide-part image-part right-img">
              <ImagePromptPlaceholder {...homeVisualPrompts.bannerFormula} className="home-banner__prompt" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
