const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { PrismaClient } = require("@prisma/client");
const { normalizeDatabaseEnv } = require("./database-env");

function loadDotEnv() {
  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const env = normalizeDatabaseEnv(process.env);

const OPENAI_API_BASE_URL = env.OPENAI_API_BASE_URL || "https://api.openai.com/v1";
const OPENAI_POST_MODEL =
  env.OPENAI_POST_MODEL || env.OPENAI_EMAIL_MODEL || "gpt-5.4-mini";
const OPENAI_POST_IMAGE_MODEL = env.OPENAI_POST_IMAGE_MODEL || "gpt-image-1";
const SITE_URL =
  env.NEXT_PUBLIC_SITE_URL ||
  env.VERCEL_URL ||
  "http://localhost:3000";
const DATABASE_URL = env.SUPABASE_POOLER_6543_URL || env.SUPABASE_POOLER_5432_URL;
const OPENAI_API_KEY = (env.OPENAI_API_KEY || "").trim();

if (!DATABASE_URL) {
  throw new Error("SUPABASE_POOLER_6543_URL or SUPABASE_POOLER_5432_URL is required.");
}

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required.");
}

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
  log: ["error"]
});

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function getResponseOutputText(response) {
  if (typeof response?.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const outputBlocks = Array.isArray(response?.output) ? response.output : [];

  for (const block of outputBlocks) {
    const contents = Array.isArray(block?.content) ? block.content : [];
    for (const content of contents) {
      if (typeof content?.text === "string" && content.text.trim()) {
        return content.text.trim();
      }
    }
  }

  return "";
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function buildProductSummary(product) {
  const compareAt =
    typeof product.compareAtPriceCents === "number" && product.compareAtPriceCents > product.priceCents
      ? ` (compare at $${(product.compareAtPriceCents / 100).toFixed(2)})`
      : "";

  return [
    `Product name: ${product.name}`,
    `Product code: ${product.productCode || "Not set"}`,
    `Product short name: ${product.productShortName || "Not set"}`,
    `Product URL: ${SITE_URL}/shop/${product.slug}`,
    `Category: ${product.category}`,
    `Tagline: ${product.tagline}`,
    `Short description: ${product.shortDescription}`,
    `Long description: ${product.description}`,
    `Details: ${product.details}`,
    `Price: $${(product.priceCents / 100).toFixed(2)}${compareAt}`
  ].join("\n");
}

function buildRecentPostSummary(posts) {
  if (!posts.length) {
    return "No previous AI posts exist for this product yet.";
  }

  return posts
    .map((post) => `- ${post.title} | ${post.slug} | Focus keyword: ${post.focusKeyword || "n/a"}`)
    .join("\n");
}

function buildImagePrompt(basePrompt, product) {
  return [
    basePrompt.trim(),
    `Editorial direction: make the image support an educational article related to ${product.category}, ${product.productShortName || product.productCode || "daily NAD+ support"}, and healthy-aging routines without showing any retail product.`,
    "Create a premium wellness editorial image using refined green, white, and gold tones with a polished magazine-like composition.",
    "Preferred scenes include ingredient-led still lifes, capsules in abstract premium arrangements, healthy-aging lifestyle cues, laboratory-inspired materials, cellular-energy inspired visuals, or elevated wellness environments.",
    "Do not show any supplement bottle, product jar, branded packaging, product label, ecommerce packshot, or logo.",
    "Do not depict a product being sold. The image should feel educational, editorial, and topic-led.",
    "No text, no watermark, no collage, no competitor branding, and no packaging mockups."
  ].join(" ");
}

async function requestPostDraft(product, recentPosts) {
  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", minLength: 18, maxLength: 120 },
      slug: { type: "string", minLength: 12, maxLength: 120 },
      excerpt: { type: "string", minLength: 80, maxLength: 220 },
      category: { type: "string", minLength: 4, maxLength: 40 },
      readTime: { type: "integer", minimum: 4, maximum: 12 },
      seoTitle: { type: "string", minLength: 20, maxLength: 70 },
      seoDescription: { type: "string", minLength: 120, maxLength: 160 },
      focusKeyword: { type: "string", minLength: 8, maxLength: 80 },
      secondaryKeywords: {
        type: "array",
        minItems: 3,
        maxItems: 6,
        items: { type: "string", minLength: 4, maxLength: 80 }
      },
      coverImageAlt: { type: "string", minLength: 20, maxLength: 140 },
      imagePrompt: { type: "string", minLength: 40, maxLength: 500 },
      content: { type: "string", minLength: 1200, maxLength: 9000 },
      externalLinks: {
        type: "array",
        maxItems: 2,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            label: { type: "string", minLength: 6, maxLength: 90 },
            url: { type: "string", minLength: 10, maxLength: 240 }
          },
          required: ["label", "url"]
        }
      }
    },
    required: [
      "title",
      "slug",
      "excerpt",
      "category",
      "readTime",
      "seoTitle",
      "seoDescription",
      "focusKeyword",
      "secondaryKeywords",
      "coverImageAlt",
      "imagePrompt",
      "content",
      "externalLinks"
    ]
  };

  const response = await fetch(`${OPENAI_API_BASE_URL}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_POST_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: [
                "You are ZenUP's senior SEO editor and supplement content strategist.",
                "Create people-first longevity and supplement content that is useful, original, product-aware, and safe for Google indexing.",
                "Do not write scaled-content fluff, fake reviews, fabricated statistics, unsupported scientific claims, or copied wellness cliches.",
                "Avoid medical claims, cure language, diagnosis language, disease treatment claims, guaranteed outcomes, or supplement-regulatory overreach.",
                "Write polished American English for adults shopping premium wellness supplements in the United States.",
                "Use simple markdown in the article body: ## for main section headings, ### for subheadings, and - for bullet lists.",
                "The article should feel editorial, practical, and commercially relevant without sounding like a thin affiliate page.",
                "Return only valid JSON matching the schema."
              ].join(" ")
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                `Brand: ZenUP (${SITE_URL})`,
                "Goal: create a blog article that can rank for relevant NAD+, NR, healthy-aging, and supplement-routine searches while naturally supporting the related product page.",
                "Product context:",
                buildProductSummary(product),
                "",
                "Recent AI post angles to avoid repeating too closely:",
                buildRecentPostSummary(recentPosts),
                "",
                "Article requirements:",
                "- Write a real educational article, not a product description.",
                "- Focus on one primary keyword and support it with 3 to 6 secondary keywords.",
                "- Use headings that reflect real search intent from supplement shoppers.",
                "- Include a short FAQ section in the body when relevant.",
                "- Mention the product naturally and reference its ingredient profile, positioning, and routine fit.",
                "- Keep the article original relative to previous posts for this product.",
                "- Do not mention Google, SEO, rankings, or optimization inside the article.",
                "- Do not use competitor brand names.",
                "- Avoid fear-based or disease-based framing.",
                "- The cover image prompt should describe a premium editorial article visual with no text on the image and no product shown."
              ].join("\n")
            }
          ]
        }
      ],
      reasoning: {
        effort: "medium"
      },
      text: {
        format: {
          type: "json_schema",
          name: "seo_post_draft",
          strict: true,
          schema
        }
      }
    })
  });

  const rawText = await response.text();
  const parsed = rawText ? safeJsonParse(rawText) : null;

  if (!response.ok) {
    throw new Error(`OpenAI draft request failed: ${rawText || response.status}`);
  }

  const outputText = getResponseOutputText(parsed);
  const output = outputText ? safeJsonParse(outputText) : null;

  if (!output || typeof output !== "object") {
    throw new Error("OpenAI returned an invalid draft payload.");
  }

  return {
    title: String(output.title || "").trim(),
    slug: slugify(String(output.slug || "").trim()),
    excerpt: String(output.excerpt || "").trim(),
    category: String(output.category || "").trim(),
    readTime: Math.max(4, Math.min(12, Math.round(Number(output.readTime) || 4))),
    seoTitle: String(output.seoTitle || "").trim(),
    seoDescription: String(output.seoDescription || "").trim(),
    focusKeyword: String(output.focusKeyword || "").trim(),
    secondaryKeywords: Array.isArray(output.secondaryKeywords)
      ? output.secondaryKeywords.map((item) => String(item).trim()).filter(Boolean).slice(0, 6)
      : [],
    coverImageAlt: String(output.coverImageAlt || "").trim(),
    imagePrompt: buildImagePrompt(String(output.imagePrompt || "").trim(), product),
    content: String(output.content || "").trim(),
    externalLinks: Array.isArray(output.externalLinks)
      ? output.externalLinks
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            label: String(item.label || "").trim(),
            url: String(item.url || "").trim()
          }))
          .filter((item) => item.label && item.url)
          .slice(0, 2)
      : []
  };
}

async function requestPostImage(prompt) {
  const response = await fetch(`${OPENAI_API_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_POST_IMAGE_MODEL,
      prompt,
      size: "1536x1024",
      quality: "medium"
    })
  });

  const rawText = await response.text();
  const parsed = rawText ? safeJsonParse(rawText) : null;

  if (!response.ok) {
    throw new Error(`OpenAI image request failed: ${rawText || response.status}`);
  }

  const data =
    parsed && typeof parsed === "object" && Array.isArray(parsed.data)
      ? parsed.data
      : [];
  const base64Data = typeof data?.[0]?.b64_json === "string" ? data[0].b64_json.trim() : "";

  if (!base64Data) {
    throw new Error("OpenAI did not return a post image.");
  }

  return {
    mimeType: "image/png",
    base64Data
  };
}

async function ensureUniqueSlug(baseSlug) {
  let nextSlug = baseSlug || "zenup-article";
  let suffix = 2;

  while (await prisma.post.findUnique({ where: { slug: nextSlug }, select: { id: true } })) {
    nextSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return nextSlug;
}

async function createAiPost(product) {
  const recentPosts = await prisma.post.findMany({
    where: {
      aiGenerated: true,
      sourceProductId: product.id
    },
    select: {
      title: true,
      slug: true,
      focusKeyword: true
    },
    orderBy: [{ createdAt: "desc" }],
    take: 8
  });

  const draft = await requestPostDraft(product, recentPosts);
  const uniqueSlug = await ensureUniqueSlug(draft.slug);
  const image = await requestPostImage(draft.imagePrompt);
  const now = new Date();
  const id = randomUUID();

  const post = await prisma.post.create({
    data: {
      id,
      title: draft.title,
      slug: uniqueSlug,
      excerpt: draft.excerpt,
      category: draft.category,
      readTime: draft.readTime,
      coverImageUrl: `/media/post/${id}?v=${now.getTime()}`,
      coverImageAlt: draft.coverImageAlt,
      coverImageData: image.base64Data,
      coverImageMimeType: image.mimeType,
      content: draft.content,
      seoTitle: draft.seoTitle,
      seoDescription: draft.seoDescription,
      aiGenerated: true,
      focusKeyword: draft.focusKeyword,
      secondaryKeywords: draft.secondaryKeywords.join("\n"),
      imagePrompt: draft.imagePrompt,
      externalLinks: JSON.stringify(draft.externalLinks),
      generatedAt: now,
      sourceProductId: product.id,
      published: true,
      publishedAt: now
    }
  });

  return post;
}

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      status: "ACTIVE"
    },
    select: {
      id: true,
      productCode: true,
      productShortName: true,
      name: true,
      slug: true,
      tagline: true,
      category: true,
      shortDescription: true,
      description: true,
      details: true,
      priceCents: true,
      compareAtPriceCents: true
    },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }]
  });

  if (!product) {
    throw new Error("No active product found.");
  }

  const existingPosts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true
    },
    orderBy: [{ createdAt: "desc" }]
  });

  if (existingPosts.length > 0) {
    console.log("Deleting existing posts:");
    for (const post of existingPosts) {
      console.log(`- ${post.title} (${post.slug})`);
    }
  }

  await prisma.post.deleteMany({});

  const createdPosts = [];

  for (let index = 0; index < 2; index += 1) {
    console.log(`Generating article ${index + 1} of 2...`);
    const post = await createAiPost(product);
    createdPosts.push(post);
    console.log(`Created: ${post.title} (${post.slug})`);
  }

  const lastPost = createdPosts[createdPosts.length - 1];

  await prisma.storeSetting.upsert({
    where: { key: "ai_post_last_run_at" },
    update: { value: new Date().toISOString() },
    create: { key: "ai_post_last_run_at", value: new Date().toISOString() }
  });
  await prisma.storeSetting.upsert({
    where: { key: "ai_post_last_status" },
    update: { value: "published" },
    create: { key: "ai_post_last_status", value: "published" }
  });
  await prisma.storeSetting.upsert({
    where: { key: "ai_post_last_post_id" },
    update: { value: lastPost.id },
    create: { key: "ai_post_last_post_id", value: lastPost.id }
  });
  await prisma.storeSetting.upsert({
    where: { key: "ai_post_rotation_cursor" },
    update: { value: product.id },
    create: { key: "ai_post_rotation_cursor", value: product.id }
  });

  console.log("Done. Published posts:");
  for (const post of createdPosts) {
    console.log(`- ${post.title} -> /blog/${post.slug}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
