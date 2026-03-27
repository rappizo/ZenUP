const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const firstNames = [
  "Olivia",
  "Emma",
  "Sophia",
  "Ava",
  "Isabella",
  "Mia",
  "Charlotte",
  "Amelia",
  "Harper",
  "Evelyn",
  "Abigail",
  "Ella",
  "Scarlett",
  "Grace",
  "Lily",
  "Chloe",
  "Victoria",
  "Layla",
  "Nora",
  "Zoey",
  "Hannah",
  "Aria",
  "Penelope",
  "Riley",
  "Mila",
  "Stella",
  "Lucy",
  "Hazel",
  "Sofia",
  "Ellie",
  "Madison",
  "Camila",
  "Avery",
  "Aurora",
  "Naomi",
  "Elena",
  "Sadie",
  "Clara",
  "Alice",
  "Julia"
];

const lastInitials = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const reviewPlans = {
  "pdrn-cream": {
    count: 68,
    ratings: [5, 5, 4, 5, 5, 4, 5, 5, 4, 5],
    titlePhrases: [
      "Comforting without feeling heavy",
      "My skin feels softer by morning",
      "Such a pretty cream texture",
      "A really lovely finish",
      "Looks smoother and calmer",
      "Great final step for dry days"
    ],
    texturePhrases: ["rich yet smooth", "plush and comfortable", "nourishing but refined"],
    finishPhrases: ["soft and cushioned", "healthy-looking and calm", "velvety and comforted"],
    timingPhrases: [
      "as the last step of my night routine",
      "after serum in the evening",
      "before SPF in the morning"
    ],
    resultPhrases: [
      "less tight by the end of the day",
      "much more comfortable overnight",
      "more rested and balanced overall"
    ]
  },
  "pdrn-serum": {
    count: 94,
    ratings: [5, 5, 5, 4, 5, 5, 5, 5, 4, 5, 5, 5],
    titlePhrases: [
      "This is the one I keep reaching for",
      "Glowy but still elegant",
      "Makes my routine feel expensive",
      "Beautiful under the rest of my skincare",
      "Gives me that smooth finish",
      "Exactly the texture I wanted"
    ],
    texturePhrases: ["silky and lightweight", "smooth with a polished slip", "light but still hydrating"],
    finishPhrases: ["fresh and glowy", "smooth and radiant", "bright and refined"],
    timingPhrases: [
      "right after cleansing",
      "before cream in the morning",
      "morning and night under moisturizer"
    ],
    resultPhrases: [
      "more luminous after a week",
      "more even and polished",
      "refreshed without any stickiness"
    ]
  },
  "snail-mucin-cream": {
    count: 83,
    ratings: [5, 5, 4, 5, 4, 5, 5, 5, 4, 5, 5],
    titlePhrases: [
      "So comforting at night",
      "Dewy without looking greasy",
      "A great comfort cream",
      "Makes dry skin feel much happier",
      "Softens everything right away",
      "Really nice for overnight use"
    ],
    texturePhrases: ["cushiony and comforting", "soft and plush", "rich with a dewy touch"],
    finishPhrases: ["dewy and supple", "comfortable and smooth", "plump and well-moisturized"],
    timingPhrases: [
      "to seal everything in at night",
      "after serum whenever my skin feels dry",
      "as my comfort cream in the evening"
    ],
    resultPhrases: [
      "much more replenished the next morning",
      "less flaky around dry areas",
      "soft and calm for hours"
    ]
  },
  "snail-mucin-serum": {
    count: 57,
    ratings: [5, 4, 5, 4, 5, 5, 4, 5, 4, 5],
    titlePhrases: [
      "Easy to use every day",
      "A very nice light serum",
      "Hydrating but not sticky",
      "Simple and really reliable",
      "Great under moisturizer",
      "Keeps my skin feeling fresh"
    ],
    texturePhrases: [
      "light, bouncy, and easy to spread",
      "fluid and fresh",
      "smooth and watery-light"
    ],
    finishPhrases: ["hydrated and calm", "soft and refreshed", "dewy in a very easy way"],
    timingPhrases: [
      "under moisturizer in the morning",
      "after cleansing when my skin feels dry",
      "as my first hydrating layer"
    ],
    resultPhrases: [
      "more comfortable through the day",
      "smoother under the rest of my routine",
      "less dull by the afternoon"
    ]
  }
};

const reviewContextHooks = [
  "during travel weeks",
  "while working long office days",
  "after late nights",
  "during colder weather",
  "in humid mornings",
  "for quick weekday routines"
];

const reviewResultHooks = [
  "my skin tone looks more even",
  "dry areas feel softer",
  "makeup sits cleaner on top",
  "my face feels less tight by evening",
  "my routine feels more balanced",
  "the finish looks smoother in daylight"
];

const reviewClosingHooks = [
  "I already ordered another one.",
  "This is in my weekly rotation now.",
  "I keep reaching for it over other options.",
  "It feels like a dependable staple.",
  "I would buy this again.",
  "It made my routine easier to stick to."
];

function buildDisplayName(index) {
  const firstName = firstNames[index % firstNames.length];
  const lastInitial = lastInitials[(index * 7 + 3) % lastInitials.length];
  return `${firstName} ${lastInitial}.`;
}

function seededFloat(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function pickVariant(values, seed) {
  return values[Math.floor(seededFloat(seed) * values.length) % values.length];
}

function buildReviewDate(productSlug, index) {
  const now = new Date();
  const seed = productSlug.length * 97 + index * 131 + 17;
  const minutesBack = Math.floor(seededFloat(seed + 1) * 180 * 24 * 60);
  const date = new Date(now.getTime() - minutesBack * 60 * 1000);
  const roundedMinutes = Math.floor(date.getUTCMinutes() / 5) * 5;
  date.setUTCMinutes(roundedMinutes, 0, 0);
  return date;
}

function buildUniqueReviewCopy(product, plan, index, seen) {
  const baseSeed = product.slug.length * 1000 + index * 17 + 9;
  const title = pickVariant(plan.titlePhrases, baseSeed + 3);
  const texture = pickVariant(plan.texturePhrases, baseSeed + 7);
  const finish = pickVariant(plan.finishPhrases, baseSeed + 11);
  const timing = pickVariant(plan.timingPhrases, baseSeed + 13);
  const result = pickVariant(plan.resultPhrases, baseSeed + 19);
  const context = pickVariant(reviewContextHooks, baseSeed + 23);
  const extraResult = pickVariant(reviewResultHooks, baseSeed + 29);
  const closing = pickVariant(reviewClosingHooks, baseSeed + 31);

  const variants = [
    {
      title: title,
      content: `I have been using ${product.name} ${timing}, mostly ${context}. The texture feels ${texture}, the finish looks ${finish}, and ${result}. ${closing}`
    },
    {
      title: `${title} - ${context}`,
      content: `Quick note after repeated use: ${product.name} is ${texture} and leaves my skin ${finish}. I noticed ${result}, and ${extraResult}. ${closing}`
    },
    {
      title: `${product.name}: ${title.toLowerCase()}`,
      content: `What I like most is how easy this is to layer. I apply ${product.name} ${timing}; it feels ${texture} and looks ${finish}. Within a few days, ${result}.`
    },
    {
      title: `Real routine feedback - ${title}`,
      content: `My skin can be inconsistent, but this one worked well for me. ${product.name} feels ${texture}, wears ${finish}, and ${extraResult}. ${closing}`
    }
  ];

  for (let attempt = 0; attempt < variants.length + 4; attempt += 1) {
    const variant = variants[attempt % variants.length];
    const nextTitle =
      attempt < variants.length
        ? variant.title
        : `${variant.title} (${index + 1}-${attempt - variants.length + 1})`;
    const nextContent =
      attempt < variants.length
        ? variant.content
        : `${variant.content} I use it ${timing} and still get a ${finish} look.`;
    const signature = `${nextTitle}\n${nextContent}`;

    if (!seen.has(signature)) {
      seen.add(signature);
      return {
        title: nextTitle,
        content: nextContent
      };
    }
  }

  const fallbackTitle = `${title} #${index + 1}`;
  const fallbackContent = `${product.name} feels ${texture}, looks ${finish}, and ${result}. ${closing}`;
  seen.add(`${fallbackTitle}\n${fallbackContent}`);

  return {
    title: fallbackTitle,
    content: fallbackContent
  };
}

function buildProductReviews(product, plan) {
  const seen = new Set();

  return Array.from({ length: plan.count }, (_, index) => {
    const reviewDate = buildReviewDate(product.slug, index);
    const copy = buildUniqueReviewCopy(product, plan, index, seen);

    return {
      id: `sample-review-${product.slug}-${index + 1}`,
      productId: product.id,
      rating: plan.ratings[index % plan.ratings.length],
      title: copy.title,
      content: copy.content,
      displayName: buildDisplayName(index + product.slug.length),
      reviewDate,
      verifiedPurchase: index % 4 !== 0,
      status: "PUBLISHED",
      source: "ADMIN_IMPORT",
      publishedAt: reviewDate,
      customerId: null,
      orderId: null
    };
  });
}

async function main() {
  const targetSlugs = Object.keys(reviewPlans);
  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: targetSlugs
      }
    },
    select: {
      id: true,
      name: true,
      slug: true
    }
  });

  if (products.length === 0) {
    throw new Error("No matching products found. Please check product slugs before resetting reviews.");
  }

  const rows = products.flatMap((product) => buildProductReviews(product, reviewPlans[product.slug]));

  const result = await prisma.$transaction(async (tx) => {
    const deleted = await tx.productReview.deleteMany({});
    let inserted = 0;

    for (let index = 0; index < rows.length; index += 100) {
      const chunk = rows.slice(index, index + 100);
      if (chunk.length === 0) {
        continue;
      }

      const created = await tx.productReview.createMany({
        data: chunk,
        skipDuplicates: true
      });
      inserted += created.count;
    }

    return {
      deleted: deleted.count,
      inserted
    };
  });

  const productSummary = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    count: rows.filter((row) => row.productId === product.id).length
  }));

  console.log("Review reset completed.");
  console.log(JSON.stringify({ ...result, productSummary }, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
