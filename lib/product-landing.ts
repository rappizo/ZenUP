export const LEGACY_PRODUCT_SLUG = "zenup-nad-plus-nicotinamide-riboside";
export const CANONICAL_PRODUCT_ALIAS_SLUG = "nicotinamide-riboside-supplement";
export const CANONICAL_PRODUCT_PATH = `/products/${CANONICAL_PRODUCT_ALIAS_SLUG}`;

export const PRODUCT_LANDING_SEO_TITLE =
  "Nicotinamide Riboside Supplement | NAD+ Support with CoQ10 & Resveratrol";

export const PRODUCT_LANDING_META_DESCRIPTION =
  "Discover an advanced Nicotinamide Riboside supplement for daily NAD+ support, featuring CoQ10 and Resveratrol in 120 veggie capsules for healthy aging and wellness support.";

export const PRODUCT_LANDING_PRIMARY_KEYWORD = "Nicotinamide Riboside supplement";

export const PRODUCT_LANDING_SECONDARY_KEYWORDS = [
  "NAD+ support",
  "NR supplement",
  "CoQ10 and Resveratrol",
  "healthy aging support",
  "cellular wellness",
  "antioxidant support",
  "veggie capsules",
  "daily wellness"
];

export function getCanonicalProductPath(slug: string) {
  if (slug === LEGACY_PRODUCT_SLUG) {
    return CANONICAL_PRODUCT_PATH;
  }

  return `/shop/${slug}`;
}
