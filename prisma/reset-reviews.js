const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
  const product = await prisma.product.findUnique({
    where: {
      slug: "zenup-nad-plus-nicotinamide-riboside"
    },
    select: {
      id: true,
      name: true
    }
  });

  if (!product) {
    throw new Error("ZenUP product not found. Seed the product before resetting reviews.");
  }

  await prisma.productReview.deleteMany({
    where: {
      productId: product.id
    }
  });

  await prisma.productReview.createMany({
    data: reviews.map((review) => ({
      ...review,
      status: "PUBLISHED",
      source: "ADMIN_IMPORT",
      productId: product.id,
      customerId: null,
      orderId: null,
      publishedAt: review.reviewDate,
      createdAt: review.reviewDate,
      updatedAt: review.reviewDate
    }))
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        product: product.name,
        insertedCount: reviews.length
      },
      null,
      2
    )
  );
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
