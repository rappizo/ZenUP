import { prisma } from "@/lib/db";

const PRODUCT_CODE_WIDTH = 4;

function parseProductCodeNumber(value: string | null | undefined) {
  const parsed = Number.parseInt((value || "").trim(), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatProductCodeNumber(value: number) {
  return String(Math.max(0, Math.trunc(value))).padStart(PRODUCT_CODE_WIDTH, "0");
}

export function normalizeProductCode(value: string | null | undefined) {
  const raw = (value || "").trim();

  if (!raw) {
    return "";
  }

  const digitsOnly = raw.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  return digitsOnly.length >= PRODUCT_CODE_WIDTH
    ? digitsOnly
    : digitsOnly.padStart(PRODUCT_CODE_WIDTH, "0");
}

export function parseProductCodesInput(value: string | null | undefined) {
  const tokens = (value || "")
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (tokens.some((token) => token.toUpperCase() === "ALL")) {
    return {
      appliesToAll: true,
      codes: [] as string[]
    };
  }

  return {
    appliesToAll: false,
    codes: Array.from(
      new Set(tokens.map((token) => normalizeProductCode(token)).filter(Boolean))
    )
  };
}

export function serializeProductCodes(codes: string[]) {
  return codes.join("\n");
}

export async function getNextProductCode() {
  const existingProducts = await prisma.product.findMany({
    where: {
      productCode: {
        not: null
      }
    },
    select: {
      productCode: true
    }
  });

  const highestCodeNumber = existingProducts.reduce((max, product) => {
    const nextValue = parseProductCodeNumber(product.productCode);
    return nextValue > max ? nextValue : max;
  }, 0);

  return formatProductCodeNumber(highestCodeNumber + 1);
}

export async function ensureProductCodes() {
  const [productsWithCodes, missingProducts] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        productCode: {
          not: null
        }
      },
      select: {
        productCode: true
      }
    }),
    prisma.product.findMany({
      where: {
        productCode: null
      },
      select: {
        id: true
      },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }]
    })
  ]);

  if (missingProducts.length === 0) {
    return;
  }

  let nextCodeNumber = productsWithCodes.reduce((max, product) => {
    const nextValue = parseProductCodeNumber(product.productCode);
    return nextValue > max ? nextValue : max;
  }, 0);

  for (const product of missingProducts) {
    nextCodeNumber += 1;
    await prisma.product.update({
      where: { id: product.id },
      data: {
        productCode: formatProductCodeNumber(nextCodeNumber)
      }
    });
  }
}
