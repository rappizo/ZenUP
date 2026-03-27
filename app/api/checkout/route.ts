import { NextResponse } from "next/server";
import { getCartDetails } from "@/lib/cart";
import {
  buildDiscountedStripeLineItems,
  normalizeCouponCode,
  parseStoredCouponProductCodes
} from "@/lib/coupons";
import { createCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/db";
import { sendCustomerWelcomeEmail } from "@/lib/email";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";
import { getProductById } from "@/lib/queries";
import { getBaseUrl, stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = String(formData.get("productId") || "");
  const quantity = Math.max(1, Math.min(10, Number(formData.get("quantity") || 1)));
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const firstName = String(formData.get("firstName") || "").trim() || null;
  const lastName = String(formData.get("lastName") || "").trim() || null;
  const rawCouponCode = normalizeCouponCode(String(formData.get("couponCode") || ""));
  const baseUrl = getBaseUrl();
  let { lines } = await getCartDetails();

  if (lines.length === 0 && productId) {
    const product = await getProductById(productId);

    if (product) {
      lines = [
        {
          product,
          quantity,
          lineTotalCents: product.priceCents * quantity
        }
      ];
    }
  }

  if (lines.length === 0 || !email) {
    return NextResponse.redirect(new URL("/cart?error=empty-cart", baseUrl), 303);
  }

  const coupon = rawCouponCode
    ? await prisma.coupon.findUnique({
        where: { code: rawCouponCode }
      })
    : null;

  if (rawCouponCode && (!coupon || !coupon.active)) {
    return NextResponse.redirect(new URL("/cart?error=coupon-invalid", baseUrl), 303);
  }

  const resolvedCoupon = coupon
    ? {
        id: coupon.id,
        code: coupon.code,
        content: coupon.content,
        active: coupon.active,
        appliesToAll: coupon.appliesToAll,
        productCodes: parseStoredCouponProductCodes(coupon.productCodes),
        discountType: coupon.discountType,
        percentOff: coupon.percentOff,
        amountOffCents: coupon.amountOffCents,
        usageMode: coupon.usageMode,
        usageCount: coupon.usageCount,
        createdAt: coupon.createdAt,
        updatedAt: coupon.updatedAt
      }
    : null;

  if (resolvedCoupon?.usageMode === "SINGLE_USE" && resolvedCoupon.usageCount > 0) {
    return NextResponse.redirect(new URL("/cart?error=coupon-used", baseUrl), 303);
  }

  const { discountCents, lineItems } = buildDiscountedStripeLineItems(lines, resolvedCoupon);

  if (rawCouponCode && discountCents <= 0) {
    return NextResponse.redirect(new URL("/cart?error=coupon-not-eligible", baseUrl), 303);
  }

  let customer = await prisma.customer.findUnique({
    where: { email }
  });

  let generatedPassword: string | null = null;

  if (!customer) {
    generatedPassword = generateTemporaryPassword();
    customer = await prisma.customer.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: hashPassword(generatedPassword),
        passwordSetAt: new Date()
      }
    });

    await createCustomerSession(customer.id);
  } else if (!customer.passwordHash) {
    generatedPassword = generateTemporaryPassword();
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        firstName: customer.firstName || firstName,
        lastName: customer.lastName || lastName,
        passwordHash: hashPassword(generatedPassword),
        passwordSetAt: new Date()
      }
    });
  }

  if (generatedPassword) {
    try {
      await sendCustomerWelcomeEmail({
        email,
        firstName: customer.firstName,
        password: generatedPassword
      });
    } catch (error) {
      console.error("Welcome email delivery failed:", error);
    }
  }

  if (!stripe) {
    return NextResponse.redirect(new URL("/cart", baseUrl), 303);
  }

  const cartMetadata = lines.map((line) => `${line.product.id}:${line.quantity}`).join(",");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    billing_address_collection: "required",
    customer_creation: "always",
    allow_promotion_codes: false,
    shipping_address_collection: {
      allowed_countries: ["US"]
    },
    metadata: {
      customerId: customer.id,
      cartItems: cartMetadata,
      couponId: resolvedCoupon?.id ?? "",
      couponCode: resolvedCoupon?.code ?? "",
      discountCents: String(discountCents)
    },
    customer_email: email,
    line_items: lineItems,
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`
  });

  return NextResponse.redirect(session.url || `${baseUrl}/cart`, 303);
}
