import type { BeautyPostRecord, ProductRecord, ProductReviewRecord, StoreSettingsRecord } from "@/lib/types";
import { getDefaultProductImageUrl, getLocalProductGallery } from "@/lib/product-media";
import { buildSiteImageUrl } from "@/lib/site-media";
import { siteConfig } from "@/lib/site-config";

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

const zenupGallery = getLocalProductGallery("zenup-nad-plus-nicotinamide-riboside");
const zenupImage =
  getDefaultProductImageUrl("zenup-nad-plus-nicotinamide-riboside") ??
  buildSiteImageUrl("home", "1.png");

const baseProduct: Omit<ProductRecord, "reviewCount" | "averageRating"> = {
  id: "prod_zenup_nad_plus",
  productCode: "ZNUP-NAD-1100",
  productShortName: "NAD+ 1100",
  amazonAsin: null,
  name: "ZenUP NAD+ Nicotinamide Riboside 1100mg",
  slug: "zenup-nad-plus-nicotinamide-riboside",
  tagline:
    "A professional NAD+ daily formula with Nicotinamide Riboside, Quercetin Phytosome, Resveratrol, and CoQ10.",
  category: "NAD+ Supplement",
  shortDescription:
    "Daily cellular-energy support in a clean 120-capsule formula built for healthy-aging routines.",
  description:
    "ZenUP NAD+ Nicotinamide Riboside 1100mg is a focused NAD+ nutrition formula designed for customers who want a serious daily supplement without unnecessary complexity. Each serving combines Nicotinamide Riboside Hydrogen Malate with Quercetin Phytosome, Trans-Resveratrol, and Coenzyme Q10 to support a modern healthy-aging routine built around cellular energy, metabolic resilience, and everyday consistency.",
  details:
    "Serving size: 2 veggie capsules.\nContains 600mg Nicotinamide Riboside Hydrogen Malate, 250mg Quercetin Phytosome, 150mg Trans-Resveratrol, and 100mg Coenzyme Q10 per serving.\n120 veggie capsules per bottle for 60 servings.\nOther ingredients: vegetable cellulose capsule, rice flour, magnesium stearate, and silicon dioxide.\nMade for adults building a consistent wellness and healthy-aging routine.",
  imageUrl: zenupImage,
  galleryImages: zenupGallery.length > 0 ? zenupGallery : [zenupImage],
  featured: true,
  status: "ACTIVE",
  inventory: 240,
  priceCents: 6900,
  compareAtPriceCents: 8900,
  currency: "USD",
  pointsReward: 69,
  stripePriceId: null,
  createdAt: new Date("2026-03-28T09:00:00.000Z"),
  updatedAt: new Date("2026-03-30T09:00:00.000Z")
};

export const sampleReviews: ProductReviewRecord[] = [
  {
    id: "rev_zenup_1",
    rating: 5,
    title: "Exactly the kind of NAD+ stack I wanted",
    content:
      "I wanted one bottle that covered Nicotinamide Riboside plus the supporting ingredients I was already taking separately. This formula feels clean, easy to stay consistent with, and much easier to keep on my desk every day.",
    displayName: "Daniel R.",
    reviewDate: new Date("2026-03-29T14:00:00.000Z"),
    status: "PUBLISHED",
    verifiedPurchase: true,
    adminNotes: null,
    source: "ADMIN_IMPORT",
    productId: baseProduct.id,
    productName: baseProduct.name,
    productSlug: baseProduct.slug,
    customerId: null,
    customerEmail: null,
    orderId: null,
    publishedAt: new Date("2026-03-29T14:00:00.000Z"),
    createdAt: new Date("2026-03-29T14:00:00.000Z"),
    updatedAt: new Date("2026-03-29T14:00:00.000Z")
  },
  {
    id: "rev_zenup_2",
    rating: 5,
    title: "Professional packaging and a serious formula",
    content:
      "The bottle presentation looks premium and the ingredient profile is stronger than most products I looked at. I like that the serving is straightforward and the supporting ingredients make sense together.",
    displayName: "Marcus T.",
    reviewDate: new Date("2026-03-28T17:00:00.000Z"),
    status: "PUBLISHED",
    verifiedPurchase: true,
    adminNotes: null,
    source: "ADMIN_IMPORT",
    productId: baseProduct.id,
    productName: baseProduct.name,
    productSlug: baseProduct.slug,
    customerId: null,
    customerEmail: null,
    orderId: null,
    publishedAt: new Date("2026-03-28T17:00:00.000Z"),
    createdAt: new Date("2026-03-28T17:00:00.000Z"),
    updatedAt: new Date("2026-03-28T17:00:00.000Z")
  },
  {
    id: "rev_zenup_3",
    rating: 4,
    title: "Easy to build into my morning routine",
    content:
      "Two capsules is simple and the bottle gives me enough servings to stay on schedule. I appreciate that it is clearly positioned as a daily healthy-aging supplement instead of hype-heavy marketing.",
    displayName: "Grace L.",
    reviewDate: new Date("2026-03-27T12:30:00.000Z"),
    status: "PUBLISHED",
    verifiedPurchase: true,
    adminNotes: null,
    source: "ADMIN_IMPORT",
    productId: baseProduct.id,
    productName: baseProduct.name,
    productSlug: baseProduct.slug,
    customerId: null,
    customerEmail: null,
    orderId: null,
    publishedAt: new Date("2026-03-27T12:30:00.000Z"),
    createdAt: new Date("2026-03-27T12:30:00.000Z"),
    updatedAt: new Date("2026-03-27T12:30:00.000Z")
  },
  {
    id: "rev_zenup_4",
    rating: 5,
    title: "Great combination for an NAD+ focused stack",
    content:
      "I was already looking for NR, resveratrol, and CoQ10, so seeing all of them together in one formula made the decision easy. The ingredient breakdown looks thoughtful and the supplement facts panel is clear.",
    displayName: "Natalie C.",
    reviewDate: new Date("2026-03-26T11:15:00.000Z"),
    status: "PUBLISHED",
    verifiedPurchase: true,
    adminNotes: null,
    source: "ADMIN_IMPORT",
    productId: baseProduct.id,
    productName: baseProduct.name,
    productSlug: baseProduct.slug,
    customerId: null,
    customerEmail: null,
    orderId: null,
    publishedAt: new Date("2026-03-26T11:15:00.000Z"),
    createdAt: new Date("2026-03-26T11:15:00.000Z"),
    updatedAt: new Date("2026-03-26T11:15:00.000Z")
  },
  {
    id: "rev_zenup_5",
    rating: 5,
    title: "The formula looks much more complete than most NR products",
    content:
      "A lot of products lead with NR only. I like that ZenUP built a broader daily formula around it instead of leaving me to source the rest on my own.",
    displayName: "Eric H.",
    reviewDate: new Date("2026-03-25T16:45:00.000Z"),
    status: "PUBLISHED",
    verifiedPurchase: false,
    adminNotes: null,
    source: "ADMIN_IMPORT",
    productId: baseProduct.id,
    productName: baseProduct.name,
    productSlug: baseProduct.slug,
    customerId: null,
    customerEmail: null,
    orderId: null,
    publishedAt: new Date("2026-03-25T16:45:00.000Z"),
    createdAt: new Date("2026-03-25T16:45:00.000Z"),
    updatedAt: new Date("2026-03-25T16:45:00.000Z")
  },
  {
    id: "rev_zenup_6",
    rating: 4,
    title: "Strong value for a 60-serving bottle",
    content:
      "The serving count and formula strength helped justify the price for me. I also like that the label feels more premium and science-led than the average supplement page.",
    displayName: "Laura M.",
    reviewDate: new Date("2026-03-24T09:40:00.000Z"),
    status: "PUBLISHED",
    verifiedPurchase: true,
    adminNotes: null,
    source: "ADMIN_IMPORT",
    productId: baseProduct.id,
    productName: baseProduct.name,
    productSlug: baseProduct.slug,
    customerId: null,
    customerEmail: null,
    orderId: null,
    publishedAt: new Date("2026-03-24T09:40:00.000Z"),
    createdAt: new Date("2026-03-24T09:40:00.000Z"),
    updatedAt: new Date("2026-03-24T09:40:00.000Z")
  }
];

export const sampleProducts: ProductRecord[] = [
  {
    ...baseProduct,
    reviewCount: sampleReviews.length,
    averageRating: average(sampleReviews.map((review) => review.rating))
  }
];

export const samplePosts: BeautyPostRecord[] = [
  {
    id: "post_cellular_energy_support",
    title: "What Cellular Energy Support Really Means in an NAD+ Routine",
    slug: "what-cellular-energy-support-really-means-in-an-nad-plus-routine",
    excerpt:
      "A practical guide to how shoppers interpret cellular energy support, why NAD+ is part of that conversation, and what makes a daily routine feel complete.",
    category: "Cellular Energy",
    readTime: 6,
    coverImageUrl: buildSiteImageUrl("blog", "cellular-energy-editorial.svg"),
    coverImageAlt:
      "Editorial illustration of capsules, molecular pathways, and cellular energy motifs in ZenUP green and gold tones with no product shown.",
    content:
      "## Why cellular energy support gets so much attention\n\nCellular energy support has become one of the most common phrases in the NAD+ category because it helps shoppers connect a technical ingredient story to an everyday routine. NAD+ is involved in energy metabolism at the cellular level, so when people start researching healthy-aging supplements, they often encounter the idea that maintaining NAD+ status is part of supporting daily resilience and long-term wellness.\n\nThat does not mean a supplement should be sold as a quick fix. In practice, customers are usually looking for a routine that feels credible, consistent, and easy to maintain. The strongest product pages explain what the formula is designed to support, how it fits into a daily schedule, and why the serving size and ingredient choices make sense together.\n\n## Why NAD+ is part of the routine conversation\n\nNAD+ is a coenzyme found throughout the body and is closely tied to how cells produce and manage energy. Because NAD+ levels can change over time, the category has grown around ingredients that help support the body's NAD+ pathway. That is why shoppers often compare Nicotinamide Riboside, NMN, serving strength, and supporting ingredients when evaluating different options.\n\nFor many customers, the real question is not simply whether an ingredient sounds advanced. The better question is whether the entire formula feels like something they can use every day without creating more friction. A daily NAD+ routine usually works best when the messaging is clear, the serving size is straightforward, and the ingredient story does not feel scattered.\n\n## What shoppers usually look for in a serious formula\n\nWhen customers compare options in this category, they often focus on a few points first:\n\n- The amount of the leading NAD+ support ingredient per serving\n- Whether the serving size is realistic for daily use\n- Whether the supporting ingredients feel intentional or just decorative\n- Whether the bottle count and price create a strong value story\n- Whether the product page explains the routine clearly without hype\n\nA formula like ZenUP is easier to understand because the page is built around one flagship product instead of a crowded catalog. Nicotinamide Riboside Hydrogen Malate leads the formula, while Quercetin Phytosome, Trans-Resveratrol, and CoQ10 reinforce the idea that the routine is meant to feel complete rather than pieced together from several separate bottles.\n\n## Why consistency matters more than complexity\n\nOne of the easiest mistakes in a healthy-aging routine is making it too complicated too early. Customers may start with several disconnected products, multiple serving windows, and a plan that feels difficult to maintain after the first few weeks. A cleaner routine usually performs better because it is easier to repeat.\n\nThat is one reason all-in-one positioning matters. If the goal is to support a daily wellness routine, the product has to feel sustainable. A simple two-capsule serving, a clear ingredient panel, and a bottle that covers sixty servings can make the routine easier to follow without turning the customer experience into a spreadsheet.\n\n## How to evaluate value without chasing hype\n\nPrice is never just the sticker amount. In this category, value usually comes from the total formula, the number of servings, and how much duplication the customer is avoiding. A bottle that combines an NAD+ precursor with supporting ingredients may justify itself differently than a single-ingredient option, especially for shoppers who were already considering additional capsules such as resveratrol or CoQ10.\n\nThat is why premium supplement brands need stronger explanation, not louder claims. The page should help the customer understand why the formula is structured the way it is and why the routine is worth keeping consistent.\n\n## FAQ\n\n### Is cellular energy support the same as a stimulant effect?\n\nNo. In the supplement category, cellular energy support usually refers to how a formula fits into the broader conversation around energy metabolism and daily wellness. It is not the same as a fast stimulant-driven experience.\n\n### Why do people compare serving count so closely?\n\nServing count affects routine consistency, reorder timing, and perceived value. A product that lasts long enough to become part of a daily habit often feels easier to commit to.\n\n### Why are supporting ingredients important in an NAD+ formula?\n\nMany shoppers do not want to build a stack bottle by bottle. Supporting ingredients can help the formula feel more complete when they are included for a clear reason instead of simply making the label look longer.\n\n### What makes a good daily NAD+ product page?\n\nClear dosage, transparent ingredient amounts, realistic routine guidance, and a calm premium presentation usually help far more than exaggerated promises.",
    seoTitle: "What Cellular Energy Support Means in an NAD+ Routine",
    seoDescription:
      "Learn what shoppers mean by cellular energy support, why NAD+ matters, and how to evaluate a daily supplement routine without hype.",
    aiGenerated: true,
    focusKeyword: "cellular energy support",
    secondaryKeywords: [
      "nad plus routine",
      "healthy aging supplements",
      "daily energy support",
      "nicotinamide riboside guide"
    ],
    imagePrompt:
      "Editorial educational cover image about cellular energy support, featuring abstract capsules, molecular pathways, premium wellness textures, green and gold tones, and no product shown.",
    externalLinks: [
      {
        label: "National Institute on Aging: What do we know about healthy aging?",
        url: "https://www.nia.nih.gov/health/healthy-aging/what-do-we-know-about-healthy-aging"
      }
    ],
    generatedAt: new Date("2026-04-01T09:00:00.000Z"),
    sourceProductId: baseProduct.id,
    sourceProductName: baseProduct.name,
    sourceProductSlug: baseProduct.slug,
    published: true,
    publishedAt: new Date("2026-04-01T09:00:00.000Z"),
    createdAt: new Date("2026-04-01T09:00:00.000Z"),
    updatedAt: new Date("2026-04-01T09:00:00.000Z")
  },
  {
    id: "post_nr_vs_nmn",
    title: "Nicotinamide Riboside vs NMN: How Shoppers Compare NAD+ Support Options",
    slug: "nicotinamide-riboside-vs-nmn-how-shoppers-compare-options",
    excerpt:
      "A balanced look at how shoppers compare Nicotinamide Riboside and NMN, what really matters on a product page, and how to choose a routine you can actually keep using.",
    category: "Comparison Guide",
    readTime: 7,
    coverImageUrl: buildSiteImageUrl("blog", "nr-vs-nmn-editorial.svg"),
    coverImageAlt:
      "Editorial comparison illustration featuring capsules, comparison panels, and abstract longevity symbols in green and gold tones with no product shown.",
    content:
      "## Why the NR vs NMN comparison keeps coming up\n\nOnce shoppers move beyond the phrase NAD+ support, one of the first real comparison questions they ask is whether to choose Nicotinamide Riboside or NMN. The reason is simple: both are commonly discussed as part of the same broader routine category, and most customers want to understand the practical difference before they commit to a daily product.\n\nThe comparison is not just about chemistry. It is also about clarity, trust, and how the formula is presented. Customers want to know what ingredient leads the formula, how much of it they are actually getting, what the rest of the label is doing, and whether the routine feels realistic for everyday use.\n\n## How shoppers usually approach the decision\n\nMost buyers do not start with a deep scientific framework. They start with a simpler checklist:\n\n- Which ingredient is leading the product story?\n- Is the serving strength clearly stated?\n- Are there useful supporting ingredients?\n- Does the page explain the routine calmly and clearly?\n- Does the product look like something built for long-term use rather than a trend cycle?\n\nThat means the comparison often turns into a buying-decision exercise more than a purely technical debate. Even when people search for Nicotinamide Riboside vs NMN, they are usually trying to figure out which finished product feels more trustworthy and easier to keep in rotation.\n\n## Why formulation context matters more than ingredient names alone\n\nA single headline ingredient can get attention, but most premium supplement shoppers also care about the rest of the formula. They want to know whether the product makes sense as a daily routine, not just whether one ingredient is popular in search.\n\nThat is where formula architecture becomes important. ZenUP uses Nicotinamide Riboside Hydrogen Malate as the lead, then supports the positioning with Quercetin Phytosome, Trans-Resveratrol, and CoQ10. For a customer who wants one bottle to cover the core conversation around NAD+ support, that kind of structure can feel more practical than managing several separate products.\n\n## What to compare on the label before buying\n\nWhen evaluating an NR-based product, it helps to look at the entire label rather than just the front-facing headline. Useful things to compare include:\n\n- The amount of Nicotinamide Riboside per serving\n- The total number of servings per bottle\n- Whether the supporting ingredients are relevant and clearly quantified\n- Whether the serving size is easy to follow every day\n- Whether the price reflects the full formula rather than only the leading ingredient\n\nA strong product page should make these comparisons easy. If the customer has to dig too hard to understand the formula, the purchase decision becomes harder than it needs to be.\n\n## How routine fit influences the choice\n\nThe right option is often the one a customer can actually stay consistent with. If a formula feels overly fragmented, hard to interpret, or expensive for what it delivers, the routine becomes more difficult to maintain. On the other hand, a well-structured formula with a clear serving size and a sixty-serving bottle often feels easier to adopt as a long-term habit.\n\nThat is why premium presentation matters in this category. The product does not just need a good ingredient story. It also needs to signal that the routine is orderly, credible, and worth repeating.\n\n## FAQ\n\n### Is the NR vs NMN conversation only about one ingredient being better?\n\nNot usually. For most shoppers, the real decision includes formula structure, serving size, supporting ingredients, and whether the product feels realistic for daily use.\n\n### Why do supporting ingredients affect the comparison so much?\n\nBecause many customers want one bottle that covers a fuller routine. A supporting stack can change the overall value and convenience of the product.\n\n### What should I compare first on an NR product page?\n\nStart with per-serving amount, supporting ingredients, servings per bottle, and how clearly the page explains the daily routine.\n\n### Why does premium presentation matter in supplement shopping?\n\nIt shapes trust. When the formula, value, and routine are explained clearly, customers can make a decision faster and with more confidence.",
    seoTitle: "Nicotinamide Riboside vs NMN: How to Compare Options",
    seoDescription:
      "Compare Nicotinamide Riboside vs NMN the practical way by looking at formula design, serving strength, routine fit, and real buying factors.",
    aiGenerated: true,
    focusKeyword: "nicotinamide riboside vs nmn",
    secondaryKeywords: [
      "nad support options",
      "nr vs nmn comparison",
      "nicotinamide riboside supplement",
      "healthy aging routine"
    ],
    imagePrompt:
      "Editorial comparison cover image about nicotinamide riboside vs NMN, featuring abstract capsules, comparison grids, premium wellness symbols, green and gold tones, and no product shown.",
    externalLinks: [
      {
        label: "NIH Office of Dietary Supplements: Using dietary supplements wisely",
        url: "https://ods.od.nih.gov/factsheets/WYNTK-Consumer/"
      }
    ],
    generatedAt: new Date("2026-04-01T09:20:00.000Z"),
    sourceProductId: baseProduct.id,
    sourceProductName: baseProduct.name,
    sourceProductSlug: baseProduct.slug,
    published: true,
    publishedAt: new Date("2026-04-01T09:20:00.000Z"),
    createdAt: new Date("2026-04-01T09:20:00.000Z"),
    updatedAt: new Date("2026-04-01T09:20:00.000Z")
  }
];

export const sampleStoreSettings: StoreSettingsRecord = {
  shipping_region: "United States only",
  support_email: siteConfig.supportEmail,
  support_phone: siteConfig.phone,
  reward_rule: "1 point per $1 spent",
  stripe_mode: "Test mode until live keys are added",
  email_enabled: "false",
  smtp_host: "",
  smtp_port: "587",
  smtp_secure: "false",
  smtp_user: "",
  smtp_pass: "",
  email_from_name: "ZenUP",
  email_from_address: "",
  contact_recipient: "",
  brevo_enabled: "false",
  brevo_sync_subscribe: "true",
  brevo_sync_contact: "false",
  brevo_sync_customers: "true",
  brevo_sender_name: "ZenUP",
  brevo_sender_email: "",
  brevo_reply_to: "",
  brevo_test_email: "",
  brevo_subscribers_list_id: "",
  brevo_contact_list_id: "",
  brevo_customers_list_id: "",
  ai_post_enabled: "false",
  ai_post_cadence_days: "2",
  ai_post_auto_publish: "false",
  ai_post_include_external_links: "true",
  ai_post_last_run_at: "",
  ai_post_last_status: "",
  ai_post_last_post_id: "",
  ai_post_rotation_cursor: ""
};
