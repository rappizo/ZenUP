export const NMN_PRODUCT_SLUGS_BY_SIZE = {
  "60ct": "zenup-nmn-supplement-60ct",
  "90ct": "zenup-nmn-supplement-90ct",
  "120ct": "zenup-nmn-supplement-120ct"
} as const;

export type NmnVariantSize = keyof typeof NMN_PRODUCT_SLUGS_BY_SIZE;

export const NMN_VARIANT_SIZES: NmnVariantSize[] = ["60ct", "90ct", "120ct"];
export const NMN_PRIMARY_PRODUCT_SLUG = NMN_PRODUCT_SLUGS_BY_SIZE["120ct"];
export const NMN_CANONICAL_PRODUCT_ALIAS_SLUG = "nmn-supplement";
export const NMN_CANONICAL_PRODUCT_PATH = `/products/${NMN_CANONICAL_PRODUCT_ALIAS_SLUG}`;

export const NMN_PRODUCT_SEO_TITLE =
  "NMN Supplement | Daily Wellness Support with Quercetin, Resveratrol, CoQ10 & Astaxanthin";

export const NMN_PRODUCT_META_DESCRIPTION =
  "Explore ZenUP NMN Supplement in 60ct, 90ct, and 120ct options, featuring Quercetin, Resveratrol, CoQ10, and Astaxanthin for premium daily cellular wellness support.";

export const NMN_PRODUCT_PRIMARY_KEYWORD = "NMN supplement";

export const NMN_PRODUCT_SECONDARY_KEYWORDS = [
  "daily NMN support",
  "NMN quercetin resveratrol",
  "CoQ10 and astaxanthin supplement",
  "cellular wellness support",
  "veggie capsules",
  "healthy aging routine",
  "premium supplement brand"
];

export function normalizeNmnVariantSize(value: string | null | undefined): NmnVariantSize {
  const normalized = (value || "").trim().toLowerCase();

  if (normalized === "60ct" || normalized === "90ct" || normalized === "120ct") {
    return normalized;
  }

  return "120ct";
}

export function getNmnSizeFromSlug(slug: string): NmnVariantSize | null {
  const entry = Object.entries(NMN_PRODUCT_SLUGS_BY_SIZE).find(([, value]) => value === slug);
  return entry ? (entry[0] as NmnVariantSize) : null;
}

export function isNmnVariantSlug(slug: string) {
  return Boolean(getNmnSizeFromSlug(slug));
}
