import type { CouponRecord, ProductRecord } from "@/lib/types";
import { parseProductCodesInput, serializeProductCodes } from "@/lib/product-codes";

export type DiscountableCartLine = {
  product: Pick<
    ProductRecord,
    "id" | "name" | "shortDescription" | "currency" | "priceCents" | "productCode"
  >;
  quantity: number;
  lineTotalCents: number;
};

type DiscountedUnit = {
  product: DiscountableCartLine["product"];
  adjustedAmountCents: number;
};

export function normalizeCouponCode(value: string | null | undefined) {
  return (value || "").trim().toUpperCase();
}

export function parseCouponScopeInput(value: string | null | undefined) {
  return parseProductCodesInput(value);
}

export function serializeCouponScope(codes: string[]) {
  return serializeProductCodes(codes);
}

export function parseStoredCouponProductCodes(value: string | null | undefined) {
  return (value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function couponAppliesToProduct(
  coupon: Pick<CouponRecord, "appliesToAll" | "productCodes">,
  productCode: string
) {
  return coupon.appliesToAll || coupon.productCodes.includes(productCode);
}

export function formatCouponValue(coupon: Pick<CouponRecord, "discountType" | "percentOff" | "amountOffCents">) {
  if (coupon.discountType === "PERCENT") {
    return `${coupon.percentOff ?? 0}% off`;
  }

  return `$${((coupon.amountOffCents ?? 0) / 100).toFixed(2)} off`;
}

export function formatCouponScopeSummary(coupon: Pick<CouponRecord, "appliesToAll" | "productCodes">) {
  if (coupon.appliesToAll) {
    return "ALL orders";
  }

  if (coupon.productCodes.length === 0) {
    return "No product IDs selected";
  }

  return coupon.productCodes.join(", ");
}

export function calculateCouponDiscount(
  coupon: Pick<
    CouponRecord,
    "discountType" | "percentOff" | "amountOffCents" | "appliesToAll" | "productCodes"
  >,
  lines: DiscountableCartLine[]
) {
  const eligibleLines = lines.filter((line) =>
    couponAppliesToProduct(coupon, line.product.productCode)
  );
  const eligibleSubtotalCents = eligibleLines.reduce((sum, line) => sum + line.lineTotalCents, 0);

  if (eligibleSubtotalCents <= 0) {
    return {
      eligibleSubtotalCents,
      discountCents: 0
    };
  }

  const discountCents =
    coupon.discountType === "PERCENT"
      ? Math.min(
          eligibleSubtotalCents,
          Math.round(eligibleSubtotalCents * Math.max(0, Math.min(coupon.percentOff ?? 0, 100)) / 100)
        )
      : Math.min(eligibleSubtotalCents, Math.max(0, coupon.amountOffCents ?? 0));

  return {
    eligibleSubtotalCents,
    discountCents
  };
}

function distributeDiscountAcrossEligibleUnits(
  eligibleUnits: Array<{ product: DiscountableCartLine["product"]; baseAmountCents: number }>,
  discountCents: number
) {
  if (discountCents <= 0 || eligibleUnits.length === 0) {
    return eligibleUnits.map(() => 0);
  }

  const eligibleSubtotalCents = eligibleUnits.reduce((sum, unit) => sum + unit.baseAmountCents, 0);
  const allocations = eligibleUnits.map((unit) =>
    Math.min(
      unit.baseAmountCents,
      Math.floor((discountCents * unit.baseAmountCents) / eligibleSubtotalCents)
    )
  );

  let allocatedCents = allocations.reduce((sum, value) => sum + value, 0);
  let remainderCents = discountCents - allocatedCents;
  const priorityOrder = eligibleUnits
    .map((unit, index) => ({
      index,
      baseAmountCents: unit.baseAmountCents
    }))
    .sort((left, right) => right.baseAmountCents - left.baseAmountCents || left.index - right.index);

  while (remainderCents > 0) {
    let changed = false;

    for (const item of priorityOrder) {
      if (allocations[item.index] >= eligibleUnits[item.index].baseAmountCents) {
        continue;
      }

      allocations[item.index] += 1;
      allocatedCents += 1;
      remainderCents -= 1;
      changed = true;

      if (remainderCents <= 0) {
        break;
      }
    }

    if (!changed) {
      break;
    }
  }

  return allocations;
}

export function buildDiscountedStripeLineItems(
  lines: DiscountableCartLine[],
  coupon: Pick<
    CouponRecord,
    "discountType" | "percentOff" | "amountOffCents" | "appliesToAll" | "productCodes"
  > | null
) {
  const computedDiscount = coupon ? calculateCouponDiscount(coupon, lines) : { discountCents: 0 };
  const eligibleUnitPool = coupon
    ? lines.flatMap((line) =>
        couponAppliesToProduct(coupon, line.product.productCode)
          ? Array.from({ length: line.quantity }, () => ({
              product: line.product,
              baseAmountCents: line.product.priceCents
            }))
          : []
      )
    : [];
  const unitDiscounts = distributeDiscountAcrossEligibleUnits(
    eligibleUnitPool,
    computedDiscount.discountCents
  );

  let eligibleUnitIndex = 0;
  const discountedUnits: DiscountedUnit[] = [];

  for (const line of lines) {
    for (let count = 0; count < line.quantity; count += 1) {
      const isEligible = coupon ? couponAppliesToProduct(coupon, line.product.productCode) : false;
      const discountForUnit = isEligible ? unitDiscounts[eligibleUnitIndex] ?? 0 : 0;

      if (isEligible) {
        eligibleUnitIndex += 1;
      }

      discountedUnits.push({
        product: line.product,
        adjustedAmountCents: Math.max(0, line.product.priceCents - discountForUnit)
      });
    }
  }

  const groupedUnits = new Map<
    string,
    {
      product: DiscountableCartLine["product"];
      quantity: number;
      unitAmountCents: number;
    }
  >();

  for (const unit of discountedUnits) {
    const key = `${unit.product.id}:${unit.adjustedAmountCents}`;
    const existing = groupedUnits.get(key);

    if (existing) {
      existing.quantity += 1;
      continue;
    }

    groupedUnits.set(key, {
      product: unit.product,
      quantity: 1,
      unitAmountCents: unit.adjustedAmountCents
    });
  }

  return {
    discountCents: computedDiscount.discountCents,
    lineItems: Array.from(groupedUnits.values()).map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: item.product.currency.toLowerCase(),
        unit_amount: item.unitAmountCents,
        product_data: {
          name: item.product.name,
          description: item.product.shortDescription
        }
      }
    }))
  };
}
