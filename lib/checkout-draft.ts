import { cookies } from "next/headers";

const CHECKOUT_DRAFT_COOKIE_NAME = "neatique-checkout-draft";

export type CheckoutAddress = {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: "US";
};

export type CheckoutDraft = {
  email: string;
  firstName: string;
  lastName: string;
  shippingAddress: CheckoutAddress | null;
  billingAddress: CheckoutAddress | null;
  billingSameAsShipping: boolean;
};

function sanitizeText(value: unknown) {
  return String(value || "").trim();
}

function sanitizeAddress(value: unknown): CheckoutAddress | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const address: CheckoutAddress = {
    fullName: sanitizeText(raw.fullName),
    address1: sanitizeText(raw.address1),
    address2: sanitizeText(raw.address2),
    city: sanitizeText(raw.city),
    state: sanitizeText(raw.state).toUpperCase(),
    postalCode: sanitizeText(raw.postalCode),
    country: "US"
  };

  if (!address.fullName || !address.address1 || !address.city || !address.state || !address.postalCode) {
    return null;
  }

  return address;
}

function sanitizeDraft(value: unknown): CheckoutDraft | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const email = sanitizeText(raw.email).toLowerCase();
  const firstName = sanitizeText(raw.firstName);
  const lastName = sanitizeText(raw.lastName);

  if (!email) {
    return null;
  }

  return {
    email,
    firstName,
    lastName,
    shippingAddress: sanitizeAddress(raw.shippingAddress),
    billingAddress: sanitizeAddress(raw.billingAddress),
    billingSameAsShipping: Boolean(raw.billingSameAsShipping)
  };
}

export async function getCheckoutDraft() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CHECKOUT_DRAFT_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    return sanitizeDraft(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function setCheckoutDraft(draft: CheckoutDraft) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: CHECKOUT_DRAFT_COOKIE_NAME,
    value: JSON.stringify(draft),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearCheckoutDraft() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: CHECKOUT_DRAFT_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
