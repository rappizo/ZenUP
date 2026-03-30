type PromptAspect = "square" | "portrait" | "landscape" | "panorama";

type HomeVisualPrompt = {
  label: string;
  title: string;
  prompt: string;
  aspect: PromptAspect;
  tags: string[];
};

export const homeVisualPrompts = {
  bannerHero: {
    label: "Hero Prompt",
    title: "Bottle Render",
    prompt:
      "Premium studio render of a dark emerald ZenUP NAD+ bottle with a matte gold lid on a crisp white background, soft directional light, clean shadow, luxury clinical wellness aesthetic, no clutter, square crop.",
    aspect: "square",
    tags: ["product render", "green + gold", "white studio"]
  },
  bannerFormula: {
    label: "Hero Prompt",
    title: "Formula Proof Visual",
    prompt:
      "Editorial supplement-facts visual for a premium NAD+ formula, emerald and champagne-gold accents, bright white laboratory backdrop, structured ingredient callouts, high-end scientific wellness style, square crop.",
    aspect: "square",
    tags: ["supplement facts", "clinical editorial", "copy-safe"]
  },
  brandStory: {
    label: "Homepage Prompt",
    title: "Brand Story Still Life",
    prompt:
      "Minimal still life for a professional longevity supplement brand, ZenUP bottle on a white stone plinth with soft green reflection, restrained gold accent, quiet clinical atmosphere, premium ecommerce campaign style.",
    aspect: "square",
    tags: ["brand campaign", "minimal set", "luxury science"]
  },
  formulaBoard: {
    label: "Homepage Prompt",
    title: "Formula Architecture Board",
    prompt:
      "Landscape composition showing a premium NAD+ supplement facts board with ingredient hierarchy, emerald green and gold palette, strong white negative space, modern scientific wellness art direction, clean editorial lighting.",
    aspect: "landscape",
    tags: ["formula board", "landscape", "structured layout"]
  },
  routineScene: {
    label: "Homepage Prompt",
    title: "Morning Routine Scene",
    prompt:
      "High-end morning wellness routine with an adult professional, water glass, notebook, and ZenUP NAD+ bottle on a bright white desk, soft sunlight, focused healthy-aging lifestyle mood, square crop.",
    aspect: "square",
    tags: ["lifestyle", "morning ritual", "clean white desk"]
  },
  ingredientMacro: {
    label: "Homepage Prompt",
    title: "Ingredient Macro Still Life",
    prompt:
      "Macro still life of capsules, green supplement jar, gold lid, and subtle ingredient cues for resveratrol and CoQ10, styled on a white laboratory surface with sharp luxury wellness lighting, square crop.",
    aspect: "square",
    tags: ["macro detail", "capsules", "ingredient-led"]
  },
  ctaBanner: {
    label: "Homepage Prompt",
    title: "CTA Campaign Banner",
    prompt:
      "Landscape landing-page banner for a premium NAD+ supplement, emerald ZenUP bottle with gold lid on white architectural surfaces, soft lab-inspired background, spacious composition for text overlay, polished ecommerce finish.",
    aspect: "landscape",
    tags: ["cta banner", "landscape", "copy-safe"]
  }
} satisfies Record<string, HomeVisualPrompt>;
