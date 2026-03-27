import type { Product, ProductReview } from "@prisma/client";

type ReviewWithProduct = ProductReview & {
  product: Product;
};

type DuplicateGroup = {
  key: string;
  canonicalReviewId: string;
  duplicateReviewIds: string[];
  reviews: ReviewWithProduct[];
};

type RewritePayload = {
  title: string;
  content: string;
};

const productVoiceMap: Record<
  string,
  {
    label: string;
    textureNotes: string[];
    routineMoments: string[];
    resultNotes: string[];
    titleHooks: string[];
    comparisonHooks: string[];
  }
> = {
  "pdrn-cream": {
    label: "PDRN Pink Cream",
    textureNotes: [
      "the capsule-and-cream texture feels smoother and more elegant than a standard moisturizer",
      "it has that soft pink capsule look, but the finish on skin is calm rather than flashy",
      "the formula feels plush at first and then settles into a polished, comfortable layer"
    ],
    routineMoments: [
      "as the last step in my evening routine",
      "after serum when my skin feels dry or overworked",
      "on nights when I want my routine to feel more restorative"
    ],
    resultNotes: [
      "my skin looks more rested the next morning",
      "the surface of my skin stays smoother and less tight overnight",
      "I wake up with a softer, more settled finish"
    ],
    titleHooks: [
      "More refined than I expected",
      "The texture is the reason I kept using it",
      "This feels much more polished than a basic cream",
      "Noticeably better as a final step"
    ],
    comparisonHooks: [
      "I usually avoid richer creams, but this one never felt suffocating.",
      "Compared with the thicker creams in my cabinet, this looks more refined on skin.",
      "It gives me the comfort of a richer cream without making my routine feel heavy."
    ]
  },
  "pdrn-serum": {
    label: "PDRN5+ Serum",
    textureNotes: [
      "the texture is silky and quick to spread without leaving a tacky film",
      "it has a smoother slip than most glow serums I have tried",
      "the finish is lightweight, but it still makes my skin look more polished"
    ],
    routineMoments: [
      "right after cleansing in the morning",
      "under moisturizer twice a day",
      "as the first real treatment step after toner"
    ],
    resultNotes: [
      "my skin looks brighter and more even through the day",
      "it gives my routine a cleaner, more luminous finish",
      "I notice a fresher look without the sticky feeling I usually dislike"
    ],
    titleHooks: [
      "This is the serum I reach for first",
      "Lightweight, polished, and easy to finish",
      "A better daytime serum than I expected",
      "Looks glowy without going shiny"
    ],
    comparisonHooks: [
      "Some serums sit on top of my skin, but this one disappears in a good way.",
      "It feels more refined than the typical brightening serum texture.",
      "I like that it gives glow without making the next layer pill."
    ]
  },
  "snail-mucin-cream": {
    label: "Snail Mucin Cream",
    textureNotes: [
      "the cream feels cushiony and comforting without looking greasy",
      "it has a richer feel in the jar, but the finish on skin stays smooth",
      "the texture gives that dewy comfort effect without turning oily"
    ],
    routineMoments: [
      "before bed when my skin needs a more protective layer",
      "after serum whenever my face feels dehydrated",
      "in the evening when I want to lock everything in"
    ],
    resultNotes: [
      "my dry areas feel less rough by the next morning",
      "my skin stays softer for much longer overnight",
      "I get a more supple look instead of that flat, tired feeling"
    ],
    titleHooks: [
      "A much better comfort cream than I expected",
      "This is the one I use on dry nights",
      "Soft, dewy, and actually easy to wear",
      "A dependable overnight cream"
    ],
    comparisonHooks: [
      "It gives me the comfort I want from a night cream without the greasy after-feel.",
      "Other creams can sit too heavily on me, but this one stays balanced.",
      "The finish is dewy, but still neat enough that I do not feel over-coated."
    ]
  },
  "snail-mucin-serum": {
    label: "Snail Mucin Serum",
    textureNotes: [
      "the watery-light texture makes it easy to use every day",
      "it feels fresh and bouncy instead of sticky",
      "the serum spreads quickly and layers well under cream"
    ],
    routineMoments: [
      "as my first hydrating layer after cleansing",
      "under moisturizer on busy mornings",
      "whenever my skin feels dull or dehydrated"
    ],
    resultNotes: [
      "my skin stays more comfortable during the day",
      "it helps the rest of my routine sit more smoothly",
      "I notice a fresher, calmer look by afternoon"
    ],
    titleHooks: [
      "Simple, light, and easy to keep using",
      "A very wearable everyday serum",
      "Fresh hydration without the stickiness",
      "Much better layering than I expected"
    ],
    comparisonHooks: [
      "A lot of hydrating serums feel syrupy on me, and this one does not.",
      "It is one of the few light serums that still makes a visible difference for me.",
      "This sits cleanly under moisturizer, which matters a lot in my routine."
    ]
  }
};

function normalizeValue(value: string | null | undefined) {
  return String(value || "").trim();
}

function buildDuplicateKey(review: Pick<ProductReview, "title" | "content">) {
  return `${normalizeValue(review.title)}\n---\n${normalizeValue(review.content)}`;
}

function getVoice(product: Product) {
  return (
    productVoiceMap[product.slug] ?? {
      label: product.name,
      textureNotes: [
        "the texture is easier to wear than I expected",
        "it feels polished on skin without being fussy",
        "the finish is balanced and comfortable"
      ],
      routineMoments: [
        "as part of my daily routine",
        "after cleansing and before the final step",
        "when my skin needs something more dependable"
      ],
      resultNotes: [
        "my skin looks more settled afterward",
        "it fits into my routine without effort",
        "I keep noticing a smoother overall finish"
      ],
      titleHooks: [
        "More wearable than I expected",
        "A strong addition to my routine",
        "Worth keeping in rotation",
        "A much better finish than I expected"
      ],
      comparisonHooks: [
        "It stands out because it feels refined instead of overdone.",
        "This fits into my routine more naturally than a lot of similar products.",
        "The biggest win for me is how easy it is to keep using."
      ]
    }
  );
}

function buildRewriteVariant(review: ReviewWithProduct, variantIndex: number) {
  const voice = getVoice(review.product);
  const texture = voice.textureNotes[variantIndex % voice.textureNotes.length];
  const routine = voice.routineMoments[(variantIndex + 1) % voice.routineMoments.length];
  const result = voice.resultNotes[(variantIndex + 2) % voice.resultNotes.length];
  const titleHook = voice.titleHooks[variantIndex % voice.titleHooks.length];
  const comparison = voice.comparisonHooks[(variantIndex + 1) % voice.comparisonHooks.length];
  const mildQualifier =
    review.rating >= 5
      ? "This ended up being one of the better products in my routine."
      : "It was not dramatic overnight, but it has been consistently good for me.";

  const titleStyles = [
    `${titleHook}`,
    `${voice.label} has a much nicer finish than I expected`,
    `The feel of this one is what keeps me using it`,
    `A more polished routine step than most products in this category`
  ];

  const bodyStyles = [
    `What I noticed first was that ${texture}. I have been using it ${routine}, and ${result}. ${comparison}`,
    `Short version: ${voice.label} is easy to keep in a routine because ${texture}. I use it ${routine}, and the payoff for me is that ${result}.`,
    `I bought this hoping for a formula that would look smoother on skin, and that is pretty much what happened. ${texture}. ${mildQualifier} ${result}.`,
    `The reason I would repurchase this is the feel. ${texture}. In my routine I use it ${routine}, and it leaves everything looking neater and more finished.`
  ];

  return {
    title: titleStyles[variantIndex % titleStyles.length],
    content: bodyStyles[variantIndex % bodyStyles.length]
  } satisfies RewritePayload;
}

export function findExactDuplicateReviewGroups(reviews: ReviewWithProduct[]) {
  const groupsByKey = new Map<string, ReviewWithProduct[]>();

  for (const review of reviews) {
    const key = buildDuplicateKey(review);
    const list = groupsByKey.get(key) || [];
    list.push(review);
    groupsByKey.set(key, list);
  }

  return Array.from(groupsByKey.entries())
    .map(([key, items]) => ({
      key,
      reviews: items.sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime()),
      canonicalReviewId: items[0]?.id || "",
      duplicateReviewIds: items.slice(1).map((review) => review.id)
    }))
    .filter((group): group is DuplicateGroup => group.reviews.length > 1 && Boolean(group.canonicalReviewId));
}

export function buildReviewDeduplicationPlan(reviews: ReviewWithProduct[]) {
  const duplicateGroups = findExactDuplicateReviewGroups(reviews);
  const updates: Array<{
    id: string;
    title: string;
    content: string;
    productName: string;
    originalTitle: string;
  }> = [];

  duplicateGroups.forEach((group, groupIndex) => {
    group.reviews.slice(1).forEach((review, duplicateIndex) => {
      const rewrite = buildRewriteVariant(review, groupIndex + duplicateIndex + 1);
      updates.push({
        id: review.id,
        title: rewrite.title,
        content: rewrite.content,
        productName: review.product.name,
        originalTitle: review.title
      });
    });
  });

  return {
    totalReviews: reviews.length,
    duplicateGroupCount: duplicateGroups.length,
    duplicateGroups: duplicateGroups.map((group) => ({
      canonicalReviewId: group.canonicalReviewId,
      duplicateReviewIds: group.duplicateReviewIds,
      reviewCount: group.reviews.length,
      sampleTitle: group.reviews[0]?.title || "",
      productNames: Array.from(new Set(group.reviews.map((review) => review.product.name)))
    })),
    updates
  };
}
