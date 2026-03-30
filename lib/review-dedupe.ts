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
    formulaNotes: string[];
    routineMoments: string[];
    resultNotes: string[];
    titleHooks: string[];
    comparisonHooks: string[];
  }
> = {
  "zenup-nad-plus-nicotinamide-riboside": {
    label: "ZenUP NAD+",
    formulaNotes: [
      "the formula feels more complete than most NR-only products I compared",
      "the ingredient panel looks serious without becoming confusing",
      "it gives me the kind of all-in-one NAD+ stack I actually wanted"
    ],
    routineMoments: [
      "with breakfast every morning",
      "as part of a simple daily healthy-aging routine",
      "when I want to stay consistent without managing multiple bottles"
    ],
    resultNotes: [
      "the routine feels easier to keep up with",
      "I trust the stack more than a single-ingredient product",
      "the formula feels like a better long-term fit for my goals"
    ],
    titleHooks: [
      "More complete than most NR formulas",
      "The ingredient stack is what sold me",
      "Exactly the kind of NAD+ product I was looking for",
      "Easy to keep in a daily routine"
    ],
    comparisonHooks: [
      "Compared with most products in this category, the label feels much more thought through.",
      "It reads like a serious stack rather than just another trendy capsule.",
      "I like that it reduces the need to piece the formula together myself."
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
      formulaNotes: [
        "the formula feels more useful than I expected",
        "the product presentation makes it easy to understand what I am buying",
        "it is easier to keep using than some of the alternatives I tried"
      ],
      routineMoments: [
        "as part of my daily routine",
        "on a regular morning schedule",
        "when I want a cleaner supplement setup"
      ],
      resultNotes: [
        "the product fits naturally into my routine",
        "I am more likely to stay consistent with it",
        "it feels like a stronger long-term option"
      ],
      titleHooks: [
        "Worth keeping in rotation",
        "More practical than I expected",
        "A stronger formula story than most",
        "Easy to use every day"
      ],
      comparisonHooks: [
        "It stands out because the product story feels clearer than most.",
        "The formula is easier to trust when the label is this direct.",
        "The biggest win for me is how easy it is to evaluate."
      ]
    }
  );
}

function buildRewriteVariant(review: ReviewWithProduct, variantIndex: number) {
  const voice = getVoice(review.product);
  const formula = voice.formulaNotes[variantIndex % voice.formulaNotes.length];
  const routine = voice.routineMoments[(variantIndex + 1) % voice.routineMoments.length];
  const result = voice.resultNotes[(variantIndex + 2) % voice.resultNotes.length];
  const titleHook = voice.titleHooks[variantIndex % voice.titleHooks.length];
  const comparison = voice.comparisonHooks[(variantIndex + 1) % voice.comparisonHooks.length];

  const titleStyles = [
    `${titleHook}`,
    `${voice.label} fits easily into my routine`,
    `The formula on this one feels more complete`,
    `A better all-in-one supplement than I expected`
  ];

  const bodyStyles = [
    `What stood out first was that ${formula}. I use it ${routine}, and ${result}. ${comparison}`,
    `Short version: ${voice.label} is easy to keep in rotation because ${formula}. I use it ${routine}, and ${result}.`,
    `I bought this hoping for a cleaner daily NAD+ setup, and that is basically what I got. ${formula}. ${comparison}`,
    `The reason I would keep using this is simple: ${formula}. In my routine I use it ${routine}, and ${result}.`
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
