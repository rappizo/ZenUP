const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const defaultSupportEmail = (process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "").trim();
const defaultSupportPhone = (process.env.NEXT_PUBLIC_SUPPORT_PHONE || "").trim();

function buildProductMediaUrl(folder, fileName) {
  return `/media/product/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`;
}

function buildSiteMediaUrl(folder, fileName) {
  return `/media/site/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`;
}

const product = {
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
  imageUrl: buildProductMediaUrl("ZenUP NAD+ Supplement", "main3.png"),
  galleryImages: [
    buildProductMediaUrl("ZenUP NAD+ Supplement", "main3.png"),
    buildProductMediaUrl("ZenUP NAD+ Supplement", "SF.jpg")
  ].join("\n"),
  featured: true,
  status: "ACTIVE",
  inventory: 240,
  priceCents: 6900,
  compareAtPriceCents: 8900,
  currency: "USD",
  pointsReward: 69
};

const posts = [
  {
    id: "post_nad_guide",
    title: "What NAD+ Is and Why It Matters in a Healthy-Aging Routine",
    slug: "what-is-nad-plus-and-why-it-matters",
    excerpt:
      "A practical overview of NAD+, cellular energy, and why Nicotinamide Riboside has become a staple in modern longevity-focused supplement routines.",
    category: "Ingredient Guide",
    readTime: 5,
    coverImageUrl: buildSiteMediaUrl("blog", "ZenUP NAD Plus Guide.png"),
    content:
      "NAD+ is a coenzyme found in every cell and is closely tied to cellular energy production. Because natural NAD+ levels can decline with age, many healthy-aging supplement routines now include precursors that help support the body's NAD+ pathway.\n\nNicotinamide Riboside is one of the most recognized NAD+ precursors in this category. It is often chosen by customers who want a more focused approach to energy metabolism, daily resilience, and long-term wellness support.\n\nThe broader supplement stack matters too. Pairing Nicotinamide Riboside with ingredients like Quercetin Phytosome, Trans-Resveratrol, and CoQ10 can help create a more complete daily formula for people who want one product instead of several separate bottles.",
    seoTitle: "What NAD+ Is and Why It Matters for Cellular Energy",
    seoDescription:
      "Learn what NAD+ is, how Nicotinamide Riboside fits into the conversation, and why NAD+ support is now central to many healthy-aging routines.",
    published: true,
    publishedAt: new Date("2026-03-29T09:00:00.000Z")
  },
  {
    id: "post_nr_guide",
    title: "How to Choose a Nicotinamide Riboside Supplement Without Guessing",
    slug: "how-to-choose-a-nicotinamide-riboside-supplement",
    excerpt:
      "A straightforward checklist for evaluating NR dosage, serving count, supporting ingredients, and formula transparency before you buy.",
    category: "Buying Guide",
    readTime: 4,
    coverImageUrl: buildSiteMediaUrl("blog", "ZenUP Formula Facts.jpg"),
    content:
      "The first thing to review is the actual Nicotinamide Riboside amount per serving, not just the front-label marketing. Serious shoppers usually compare serving strength, bottle count, and whether the formula is built for consistent long-term use.\n\nNext, look at the supporting ingredients. A strong NAD+ supplement often includes compounds that fit the same healthy-aging and cellular-support conversation, such as Quercetin Phytosome, Resveratrol, or CoQ10.\n\nFinally, make sure the label is easy to read. Clear supplement facts, clear serving size, and a clean ingredient story usually tell you far more than hype-heavy claims.",
    seoTitle: "How to Choose a Nicotinamide Riboside Supplement",
    seoDescription:
      "Compare dosage, serving count, support ingredients, and label transparency when choosing a Nicotinamide Riboside supplement.",
    published: true,
    publishedAt: new Date("2026-03-27T09:00:00.000Z")
  },
  {
    id: "post_routine",
    title: "A Simple Daily Supplement Routine for Energy, Longevity, and Consistency",
    slug: "daily-supplement-routine-for-longevity-and-consistency",
    excerpt:
      "Keep your routine simple: choose a consistent morning time, take the labeled serving, and use one formula that covers the core ingredients you actually want every day.",
    category: "Routine Tips",
    readTime: 4,
    coverImageUrl: buildSiteMediaUrl("blog", "ZenUP Daily Routine.png"),
    content:
      "Most customers do better with a supplement routine they can repeat every day than with an overcomplicated stack they constantly change. Start by choosing one reliable time, such as breakfast or the first meal of the day.\n\nUse the labeled serving consistently and give the routine enough time to become part of your schedule. The biggest advantage of an all-in-one product is that it reduces friction and helps you avoid skipping key ingredients.\n\nIf your goal is a cleaner longevity-focused routine, look for formulas that combine NAD+ support with complementary ingredients instead of making you manage multiple bottles at once.",
    seoTitle: "A Simple Daily Supplement Routine for Longevity and Consistency",
    seoDescription:
      "Build a practical daily routine around consistency, clear dosage, and an all-in-one supplement formula designed for long-term use.",
    published: true,
    publishedAt: new Date("2026-03-25T09:00:00.000Z")
  }
];

const reviews = [
  {
    id: "rev_zenup_1",
    rating: 5,
    title: "Exactly the kind of NAD+ stack I wanted",
    content:
      "I wanted one bottle that covered Nicotinamide Riboside plus the supporting ingredients I was already taking separately. This formula feels clean, easy to stay consistent with, and much easier to keep on my desk every day.",
    displayName: "Daniel R.",
    reviewDate: new Date("2026-03-29T14:00:00.000Z"),
    verifiedPurchase: true
  },
  {
    id: "rev_zenup_2",
    rating: 5,
    title: "Professional packaging and a serious formula",
    content:
      "The bottle presentation looks premium and the ingredient profile is stronger than most products I looked at. I like that the serving is straightforward and the supporting ingredients make sense together.",
    displayName: "Marcus T.",
    reviewDate: new Date("2026-03-28T17:00:00.000Z"),
    verifiedPurchase: true
  },
  {
    id: "rev_zenup_3",
    rating: 4,
    title: "Easy to build into my morning routine",
    content:
      "Two capsules is simple and the bottle gives me enough servings to stay on schedule. I appreciate that it is clearly positioned as a daily healthy-aging supplement instead of hype-heavy marketing.",
    displayName: "Grace L.",
    reviewDate: new Date("2026-03-27T12:30:00.000Z"),
    verifiedPurchase: true
  },
  {
    id: "rev_zenup_4",
    rating: 5,
    title: "Great combination for an NAD+ focused stack",
    content:
      "I was already looking for NR, resveratrol, and CoQ10, so seeing all of them together in one formula made the decision easy. The ingredient breakdown looks thoughtful and the supplement facts panel is clear.",
    displayName: "Natalie C.",
    reviewDate: new Date("2026-03-26T11:15:00.000Z"),
    verifiedPurchase: true
  },
  {
    id: "rev_zenup_5",
    rating: 5,
    title: "The formula looks much more complete than most NR products",
    content:
      "A lot of products lead with NR only. I like that ZenUP built a broader daily formula around it instead of leaving me to source the rest on my own.",
    displayName: "Eric H.",
    reviewDate: new Date("2026-03-25T16:45:00.000Z"),
    verifiedPurchase: false
  },
  {
    id: "rev_zenup_6",
    rating: 4,
    title: "Strong value for a 60-serving bottle",
    content:
      "The serving count and formula strength helped justify the price for me. I also like that the label feels more premium and science-led than the average supplement page.",
    displayName: "Laura M.",
    reviewDate: new Date("2026-03-24T09:40:00.000Z"),
    verifiedPurchase: true
  }
];

async function main() {
  await prisma.product.upsert({
    where: { slug: product.slug },
    update: {
      productCode: product.productCode,
      productShortName: product.productShortName,
      amazonAsin: product.amazonAsin,
      name: product.name,
      tagline: product.tagline,
      category: product.category,
      shortDescription: product.shortDescription,
      description: product.description,
      details: product.details,
      imageUrl: product.imageUrl,
      galleryImages: product.galleryImages,
      featured: product.featured,
      status: product.status,
      inventory: product.inventory,
      priceCents: product.priceCents,
      compareAtPriceCents: product.compareAtPriceCents,
      currency: product.currency,
      pointsReward: product.pointsReward
    },
    create: product
  });

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        readTime: post.readTime,
        coverImageUrl: post.coverImageUrl,
        content: post.content,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        published: post.published,
        publishedAt: post.publishedAt
      },
      create: post
    });
  }

  for (const [key, value] of Object.entries({
    shipping_region: "United States only",
    support_email: defaultSupportEmail,
    support_phone: defaultSupportPhone,
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
    brevo_customers_list_id: ""
  })) {
    await prisma.storeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  const storedProduct = await prisma.product.findUnique({
    where: { slug: product.slug }
  });

  if (!storedProduct) {
    throw new Error("Seed product could not be loaded after upsert.");
  }

  await prisma.productReview.deleteMany({
    where: {
      productId: storedProduct.id
    }
  });

  await prisma.productReview.createMany({
    data: reviews.map((review) => ({
      ...review,
      status: "PUBLISHED",
      source: "ADMIN_IMPORT",
      productId: storedProduct.id,
      publishedAt: review.reviewDate,
      createdAt: review.reviewDate,
      updatedAt: review.reviewDate
    }))
  });
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
