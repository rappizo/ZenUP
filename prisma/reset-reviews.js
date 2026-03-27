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
  "at13-arbutin-tranexamic-cream": {
    count: 61,
    ratings: [5, 5, 4, 5, 4, 5, 5, 4, 5, 5, 4],
    titleHooks: [
      "This cream fits perfectly after serum",
      "My skin looks smoother around old marks",
      "Soft finish with a more even look",
      "Much easier to wear than heavier tone creams",
      "Clean under sunscreen and makeup",
      "One of the nicest daily creams I have tried"
    ],
    toneHooks: [
      "I wanted a cream that could sit comfortably over active serums.",
      "My skin can look uneven when I am not consistent with routine.",
      "I bought this for daytime use because I dislike heavy jars.",
      "I was trying to simplify my routine without losing that polished finish."
    ],
    texturePhrases: [
      "smooth and airy for a cream",
      "cushioned without turning greasy",
      "soft on contact and neat once it settles",
      "creamy enough for comfort but still elegant on skin"
    ],
    routinePhrases: [
      "after serum before SPF",
      "as the last step in my morning routine",
      "over hydrating layers on workdays",
      "morning and night when my skin looks uneven"
    ],
    resultPhrases: [
      "older post-blemish marks look less obvious in daylight",
      "my skin tone looks more even around the cheeks",
      "makeup sits cleaner over areas that usually look patchy",
      "the finish looks more settled by midday"
    ],
    comparisonPhrases: [
      "It feels more elegant than the tone creams I used before.",
      "Compared with gel creams, this gives more comfort without extra shine.",
      "It gives me a smoother finish than most daytime moisturizers.",
      "This one looks refined on skin instead of pasty."
    ],
    closingPhrases: [
      "I keep reaching for it because it makes mornings easier.",
      "This is the cream I would reorder for daily use.",
      "It made my routine feel more put together without extra steps.",
      "I like having this as my dependable final layer."
    ],
    variationTags: ["morning routine", "daily tone care", "under makeup", "easy layering"]
  },
  "nt16-niacinamide-tranexamic-serum": {
    count: 88,
    ratings: [5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 5, 5],
    titleHooks: [
      "This became my go-to niacinamide serum",
      "Refined finish without the chalky feel",
      "A steady serum for old marks and texture",
      "One bottle and my routine feels cleaner",
      "Very wearable for daytime",
      "My skin looks more even on camera"
    ],
    toneHooks: [
      "I wanted a niacinamide serum that did more than just sit on top of my skin.",
      "My old dark spot serum felt harsh, so I switched to this.",
      "I was looking for a tranexamic serum that could still feel polished every morning.",
      "My routine works best when one serum can handle both texture and uneven-looking tone."
    ],
    texturePhrases: [
      "sleek and quick to settle",
      "smooth with a soft serum slip",
      "lightweight with enough body to feel substantial",
      "clean and silky without leaving tack behind"
    ],
    routinePhrases: [
      "after cleansing and before moisturizer",
      "under sunscreen on most weekdays",
      "in both my morning and night routine",
      "as the first treatment step after toner"
    ],
    resultPhrases: [
      "the look of old spots is less distracting",
      "my T-zone looks smoother and calmer",
      "the overall tone of my face looks more even",
      "foundation catches less on the areas that used to look rough"
    ],
    comparisonPhrases: [
      "Compared with stronger niacinamide serums, this feels less harsh on my skin.",
      "It sits better under moisturizer than the last dark spot serum I bought.",
      "This one gives a cleaner finish than most treatment serums in my drawer.",
      "It feels more balanced than products that only focus on one ingredient."
    ],
    closingPhrases: [
      "This is the bottle I keep near the sink now.",
      "I would repurchase because it is easy to stay consistent with.",
      "It made my routine feel more reliable from day to day.",
      "I like how polished my skin looks when this is part of the routine."
    ],
    variationTags: ["tone upkeep", "oil balance", "workday routine", "smooth finish"]
  },
  "tnv3-tranexamic-nicotinamide-serum": {
    count: 76,
    ratings: [5, 4, 5, 5, 4, 5, 5, 5, 4, 5, 5],
    titleHooks: [
      "This serum made my routine feel more refined",
      "A dark spot serum that layers cleanly",
      "The texture is better than most treatment serums",
      "Easy to use under moisturizer",
      "A smoother look around old marks",
      "Very good balance of freshness and comfort"
    ],
    toneHooks: [
      "I bought this because I wanted tranexamic acid, nicotinamide, and vitamin C in one step.",
      "My routine gets cluttered fast, so I like formulas that do more than one job well.",
      "I was searching for a tranexamic serum that could fit easily into daytime use.",
      "Most dark spot serums I tried before felt sticky, and this one does not."
    ],
    texturePhrases: [
      "thin but not watery",
      "sleek and silky without drag",
      "fresh going on and tidy once absorbed",
      "light enough for layering but still comfortable"
    ],
    routinePhrases: [
      "right after cleansing before cream",
      "under SPF in the morning",
      "as my main serum on most days",
      "before moisturizer when my skin looks uneven"
    ],
    resultPhrases: [
      "older spots look softer around the edges",
      "my overall tone looks more even in mirror light",
      "my skin looks clearer across the cheeks",
      "makeup catches less on the areas that used to look uneven"
    ],
    comparisonPhrases: [
      "It layers better than my previous vitamin C serum.",
      "Compared with other dark spot serums, this one feels calmer on skin.",
      "It gives me a more polished finish than most clear serums I have tried.",
      "This feels more wearable in real life than formulas that stay tacky."
    ],
    closingPhrases: [
      "I would happily keep this in my regular rotation.",
      "It feels like a smart daily serum instead of a fussy treatment.",
      "This is easy to recommend if you want one serum to do more.",
      "I like that it makes my routine feel streamlined."
    ],
    variationTags: ["spot care", "daily serum", "under SPF", "smoother finish"]
  },
  "pdrn-cream": {
    count: 68,
    ratings: [5, 5, 4, 5, 5, 4, 5, 5, 4, 5],
    titleHooks: [
      "Softer mornings with this cream",
      "Comfort that still looks polished",
      "This finished my routine perfectly",
      "The texture surprised me in a good way",
      "A calm glow without heavy residue",
      "Much easier to wear than rich creams"
    ],
    toneHooks: [
      "I bought this during a week my skin barrier felt stressed.",
      "I was looking for a cream that felt luxurious but not greasy.",
      "My skin gets tight quickly when weather changes.",
      "I wanted something that looked elegant under makeup on workdays."
    ],
    texturePhrases: [
      "creamy at first and then smooth once it settles",
      "plush while applying, then light after two minutes",
      "silky with a dense feel that never turns waxy",
      "rich enough for dry patches but still refined"
    ],
    routinePhrases: [
      "as the final step at night",
      "after PDRN serum in the evening",
      "before sunscreen when my skin feels dry",
      "in a simple three-step routine"
    ],
    resultPhrases: [
      "my cheeks look calmer when I wake up",
      "the rough texture near my jaw looks smoother",
      "my skin keeps that rested look into the afternoon",
      "I feel less dryness around my nose and mouth"
    ],
    comparisonPhrases: [
      "It performs better than most thick creams I used last year.",
      "Compared with my previous moisturizer, this one sits cleaner on skin.",
      "It gives comfort without the shiny layer I usually dislike.",
      "It feels more premium than many creams in this price range."
    ],
    closingPhrases: [
      "I keep this on my vanity because it is reliable.",
      "I would repurchase for the finish alone.",
      "This made my routine feel upgraded without adding steps.",
      "For dry evenings, this is the jar I reach for."
    ],
    variationTags: ["night routine", "barrier comfort", "daily finish", "soft glow"]
  },
  "pdrn-serum": {
    count: 94,
    ratings: [5, 5, 5, 4, 5, 5, 5, 5, 4, 5, 5, 5],
    titleHooks: [
      "This became my main daytime serum",
      "A cleaner glow than other brightening serums",
      "Layers beautifully under cream and SPF",
      "Silky texture with a refined finish",
      "My skin looks brighter without stickiness",
      "Easy serum to stay consistent with"
    ],
    toneHooks: [
      "I tested this in the morning before commuting.",
      "I wanted something light enough for humid days.",
      "My old serum pilled under sunscreen so I switched.",
      "I looked for a formula that felt polished, not syrupy."
    ],
    texturePhrases: [
      "fluid and silky with almost no tack",
      "lightweight but still hydrating enough for my dry zones",
      "quick-absorbing with a polished slip",
      "fresh on contact and easy to spread"
    ],
    routinePhrases: [
      "right after cleansing",
      "before moisturizer in both AM and PM",
      "as my first treatment layer",
      "under sunscreen every weekday"
    ],
    resultPhrases: [
      "my skin tone looks more even in photos",
      "my face looks fresher at the end of the day",
      "I notice a smoother reflection on the high points",
      "my complexion appears less dull by afternoon"
    ],
    comparisonPhrases: [
      "It gives better glow than my old niacinamide blend.",
      "Compared with heavier serums, this one wears more elegantly.",
      "It is one of the few glow serums that does not pill for me.",
      "I get brightness without that sticky film."
    ],
    closingPhrases: [
      "This one is staying in my routine.",
      "I plan to keep using it through summer.",
      "Very easy to recommend if you like lightweight textures.",
      "It is now my default serum step."
    ],
    variationTags: ["daytime use", "under SPF", "light texture", "glow step"]
  },
  "snail-mucin-cream": {
    count: 83,
    ratings: [5, 5, 4, 5, 4, 5, 5, 5, 4, 5, 5],
    titleHooks: [
      "A dependable comfort cream for dry nights",
      "Dewy but still neat on my skin",
      "This helped my flaky areas quickly",
      "The overnight feel is excellent",
      "Comforting texture without heaviness",
      "A better night cream than expected"
    ],
    toneHooks: [
      "I used this during a week of indoor heating and dry air.",
      "My skin tends to look flat at night, so I wanted more cushion.",
      "I needed a comfort cream after over-exfoliating.",
      "I looked for a formula that felt rich but not suffocating."
    ],
    texturePhrases: [
      "soft and cushiony with a dewy touch",
      "richer than a gel cream but still smooth",
      "nourishing while staying clean on the surface",
      "velvety and easy to spread over serum"
    ],
    routinePhrases: [
      "before bed as the final layer",
      "after snail serum when my skin feels tight",
      "in my evening routine on colder days",
      "as a comfort step after showering"
    ],
    resultPhrases: [
      "my skin looks less flaky by morning",
      "dry patches around my chin stay softer",
      "I wake up with a fuller and calmer finish",
      "my face feels more comfortable overnight"
    ],
    comparisonPhrases: [
      "It works better than the thicker jar cream I used before.",
      "Compared with my old night cream, this feels less greasy.",
      "It gives me dew without turning oily.",
      "This one keeps moisture longer than lighter creams."
    ],
    closingPhrases: [
      "I now keep this for every dry evening.",
      "The comfort level is the big win for me.",
      "I would buy this again for winter routines.",
      "This made my evening routine feel complete."
    ],
    variationTags: ["overnight", "dry skin", "comfort layer", "dewy finish"]
  },
  "snail-mucin-serum": {
    count: 57,
    ratings: [5, 4, 5, 4, 5, 5, 4, 5, 4, 5],
    titleHooks: [
      "Simple hydration that works every day",
      "A light serum that still feels effective",
      "Fresh, bouncy, and easy to layer",
      "Hydration without the sticky finish",
      "Great first step after cleansing",
      "This keeps my skin comfortable all day"
    ],
    toneHooks: [
      "I wanted a daily serum that would not feel heavy.",
      "My skin gets dehydrated fast in air conditioning.",
      "I switched to this because my old serum felt tacky.",
      "I needed a quick morning step before moisturizer."
    ],
    texturePhrases: [
      "watery-light and very easy to spread",
      "bouncy at first and smooth afterward",
      "fresh with almost no residue",
      "fluid enough to layer without pilling"
    ],
    routinePhrases: [
      "right after cleansing",
      "before moisturizer every morning",
      "as the first hydrating layer",
      "under both cream and sunscreen"
    ],
    resultPhrases: [
      "my skin feels less tight during long workdays",
      "the rest of my routine sits more smoothly",
      "my face looks fresher by mid-day",
      "I notice a cleaner, calmer hydration finish"
    ],
    comparisonPhrases: [
      "It feels lighter than most hydrating serums I have tried.",
      "Compared with thicker formulas, this one layers much better.",
      "I get comfort without the sticky feeling.",
      "It is easier to use daily than my previous serum."
    ],
    closingPhrases: [
      "A very practical serum for everyday routines.",
      "This has become my baseline hydration step.",
      "I like how low-effort and reliable it feels.",
      "I would recommend it for simple routines."
    ],
    variationTags: ["morning layer", "fresh texture", "daily hydration", "easy routine"]
  }
};

const reviewLifestyleHooks = [
  "on rushed weekdays",
  "during dry weather",
  "after late nights",
  "under makeup",
  "after showering",
  "while traveling",
  "on minimal-routine days",
  "when my skin looks tired"
];

const reviewFinishHooks = [
  "The finish stays neat instead of greasy.",
  "It gives a soft glow without looking shiny.",
  "It sits comfortably under the rest of my routine.",
  "It looks polished rather than heavy.",
  "It keeps my skin looking fresh for longer.",
  "It wears more elegantly than I expected."
];

const reviewOpinionHooks = [
  "This ended up feeling more polished than the price suggests.",
  "I notice it most on days when my skin looks uneven.",
  "The formula is easier to keep using than stronger alternatives.",
  "It made the rest of my routine feel more balanced.",
  "This is the kind of product I keep within easy reach.",
  "I like that it feels purposeful without feeling complicated."
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
  const titleHook = pickVariant(plan.titleHooks, baseSeed + 3);
  const tone = pickVariant(plan.toneHooks, baseSeed + 7);
  const texture = pickVariant(plan.texturePhrases, baseSeed + 11);
  const routine = pickVariant(plan.routinePhrases, baseSeed + 13);
  const result = pickVariant(plan.resultPhrases, baseSeed + 19);
  const comparison = pickVariant(plan.comparisonPhrases, baseSeed + 23);
  const closing = pickVariant(plan.closingPhrases, baseSeed + 29);
  const variation = pickVariant(plan.variationTags, baseSeed + 31);
  const lifestyle = pickVariant(reviewLifestyleHooks, baseSeed + 37);
  const extraFinish = pickVariant(reviewFinishHooks, baseSeed + 41);
  const opinion = pickVariant(reviewOpinionHooks, baseSeed + 43);
  const extraResult = pickVariant(plan.resultPhrases, baseSeed + 47);

  const modes = [
    {
      title: `${titleHook}`,
      content: `${tone} ${product.name} feels ${texture}. I use it ${routine}, and ${result}. ${closing}`
    },
    {
      title: `${titleHook} for ${variation}`,
      content: `After roughly two weeks, ${result}. ${tone} ${comparison} ${closing}`
    },
    {
      title: `${product.name} fits easily into my routine`,
      content: `I reach for ${product.name} ${routine}, especially ${lifestyle}. The texture is ${texture}. ${closing}`
    },
    {
      title: `Why I kept ${product.name}`,
      content: `${tone} ${comparison} ${product.name} feels ${texture}, and ${result}.`
    },
    {
      title: `The texture made me keep using this`,
      content: `What sold me first was the texture. ${product.name} feels ${texture}, wears well ${routine}, and ${result}.`
    },
    {
      title: `${product.name} on busy mornings`,
      content: `On busy mornings, I want something that behaves well without extra work. ${product.name} feels ${texture}, and ${result}. ${extraFinish}`
    },
    {
      title: `The difference shows up later in the day`,
      content: `The biggest difference for me shows up later in the day. ${tone} ${product.name} feels ${texture}, and ${result}. ${extraResult}.`
    },
    {
      title: `${product.name} earned a permanent spot`,
      content: `I kept rotating other products in and out, and this still kept its spot. ${product.name} feels ${texture}. ${comparison} ${closing}`
    },
    {
      title: `More refined than I expected`,
      content: `${opinion} ${tone} ${product.name} feels ${texture}, and ${result}.`
    },
    {
      title: `${variation} favorite`,
      content: `For ${variation}, this checks the boxes I care about most. ${product.name} feels ${texture}. ${comparison} ${closing}`
    },
    {
      title: `Simple, polished, and easy to use`,
      content: `Some days I want a routine that looks polished without feeling heavy. ${product.name} fits that really well ${routine}. ${result}. ${closing}`
    },
    {
      title: `${product.name} layers better than most`,
      content: `My favorite part is how easy this is to layer. ${tone} ${product.name} feels ${texture}. ${extraFinish} ${closing}`
    },
    {
      title: `One I actually finished`,
      content: `This was the one I kept finishing instead of letting it sit on a shelf. ${product.name} feels ${texture}, and ${result}. ${comparison}`
    },
    {
      title: `${titleHook} in real life`,
      content: `I noticed it most ${lifestyle}. ${product.name} wears nicely ${routine}, and ${result}. ${closing}`
    },
    {
      title: `Worth it for the texture`,
      content: `If texture matters to you, this one is easy to appreciate. ${product.name} feels ${texture}. ${extraFinish} ${closing}`
    },
    {
      title: `${product.name} keeps my routine looking neater`,
      content: `${tone} ${product.name} feels ${texture}. ${comparison} ${result}. ${closing}`
    },
    {
      title: `${titleHook} without extra fuss`,
      content: `I did not need to change the rest of my routine for this to work well. ${product.name} feels ${texture}, I use it ${routine}, and ${result}. ${closing}`
    },
    {
      title: `${product.name} feels easier to live with than most`,
      content: `I have tried enough products in this category to know when one is easy to keep using. ${comparison} ${product.name} feels ${texture}, and ${result}. ${closing}`
    },
    {
      title: `A quiet upgrade to my routine`,
      content: `${tone} ${product.name} feels ${texture}. ${extraFinish} ${result}. ${closing}`
    }
  ];

  const startIndex = Math.floor(seededFloat(baseSeed + 53) * modes.length) % modes.length;

  for (let attempt = 0; attempt < modes.length + 4; attempt += 1) {
    const mode = modes[(startIndex + attempt) % modes.length];
    const nextTitle =
      attempt < modes.length ? mode.title : `${mode.title} (${variation} ${attempt - modes.length + 1})`;
    const nextContent =
      attempt < modes.length
        ? mode.content
        : `${mode.content} I also like it for ${variation} days because it keeps my routine consistent.`;
    const signature = `${nextTitle}\n${nextContent}`;

    if (!seen.has(signature)) {
      seen.add(signature);
      return {
        title: nextTitle,
        content: nextContent
      };
    }
  }

  const fallbackTitle = `${titleHook} ${index + 1}`;
  const fallbackContent = `${tone} ${product.name} feels ${texture}. ${result}. ${closing}`;
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

function parseTargetSlugs() {
  const rawValue = process.env.REVIEW_RESET_SLUGS || "";

  if (!rawValue.trim()) {
    return Object.keys(reviewPlans);
  }

  const requested = rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const validSlugs = requested.filter((slug) => Object.prototype.hasOwnProperty.call(reviewPlans, slug));

  if (validSlugs.length === 0) {
    throw new Error(
      `No valid product slugs found in REVIEW_RESET_SLUGS. Supported values: ${Object.keys(reviewPlans).join(", ")}`
    );
  }

  return validSlugs;
}

async function main() {
  const targetSlugs = parseTargetSlugs();
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
    const deleted = await tx.productReview.deleteMany({
      where: {
        productId: {
          in: products.map((product) => product.id)
        }
      }
    });
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
  console.log(JSON.stringify({ targetSlugs, ...result, productSummary }, null, 2));
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
