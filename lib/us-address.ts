import type { CheckoutAddress } from "@/lib/checkout-draft";

export const CONTIGUOUS_US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
] as const;

const STATE_CODES = new Set<string>(CONTIGUOUS_US_STATES.map((state) => state.code));

function sanitizeText(value: unknown) {
  return String(value || "").trim();
}

export function isValidContiguousUsState(value: string) {
  return STATE_CODES.has(value.toUpperCase());
}

export function isValidUsPostalCode(value: string) {
  return /^\d{5}(?:-\d{4})?$/.test(value.trim());
}

export function buildCheckoutAddress(input: {
  fullName: unknown;
  address1: unknown;
  address2?: unknown;
  city: unknown;
  state: unknown;
  postalCode: unknown;
}): CheckoutAddress {
  return {
    fullName: sanitizeText(input.fullName),
    address1: sanitizeText(input.address1),
    address2: sanitizeText(input.address2),
    city: sanitizeText(input.city),
    state: sanitizeText(input.state).toUpperCase(),
    postalCode: sanitizeText(input.postalCode),
    country: "US"
  };
}

export function validateCheckoutAddress(address: CheckoutAddress) {
  if (!address.fullName || !address.address1 || !address.city || !address.state || !address.postalCode) {
    return "missing";
  }

  if (!isValidContiguousUsState(address.state)) {
    return "state";
  }

  if (!isValidUsPostalCode(address.postalCode)) {
    return "postal";
  }

  return null;
}
