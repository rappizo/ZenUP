import type { StoreSettingsRecord } from "@/lib/types";
import { CANONICAL_PRODUCT_PATH } from "@/lib/product-landing";

function normalizeOptionalValue(value: string | null | undefined) {
  return (value ?? "").trim();
}

function normalizeSiteUrl(value: string | null | undefined) {
  const normalized = normalizeOptionalValue(value);

  if (!normalized) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
  return withProtocol.replace(/\/+$/, "");
}

const defaultSiteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  normalizeSiteUrl(process.env.VERCEL_URL) ||
  "http://localhost:3000";

const defaultSupportEmail = normalizeOptionalValue(process.env.NEXT_PUBLIC_SUPPORT_EMAIL);
const defaultSupportPhone = normalizeOptionalValue(process.env.NEXT_PUBLIC_SUPPORT_PHONE);
const googleTagId = normalizeOptionalValue(process.env.NEXT_PUBLIC_GOOGLE_TAG_ID);

export const siteConfig = {
  name: "ZenUP",
  url: defaultSiteUrl,
  title: "ZenUP",
  description:
    "Professional NAD+ nutrition built around Nicotinamide Riboside, Quercetin Phytosome, Resveratrol, and CoQ10 for a focused healthy-aging routine.",
  accentColor: "#0f6a35",
  supportEmail: defaultSupportEmail,
  phone: defaultSupportPhone,
  googleTagId,
  nav: [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop NAD+" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" }
  ],
  adminNav: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/coupons", label: "Coupons" },
    { href: "/admin/omb-claims", label: "Claims" },
    { href: "/admin/forms", label: "Forms" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/rewards", label: "Rewards" },
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/email-marketing", label: "Email Marketing" },
    { href: "/admin/email", label: "Email" }
  ],
  footerLinks: {
    shop: [
      { href: "/shop", label: "Shop NAD+" },
      {
        href: CANONICAL_PRODUCT_PATH,
        label: "Formula Details"
      }
    ],
    discover: [
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact Us" },
      { href: "/cart", label: "Cart" },
      { href: "/account", label: "My Account" }
    ],
    policies: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-use", label: "Terms of Use" },
      { href: "/shipping-policy", label: "Shipping Policy" },
      { href: "/return-policy", label: "Return Policy" }
    ]
  }
};

function parseEnabledSetting(value: string | null | undefined) {
  const normalized = normalizeOptionalValue(value).toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "on";
}

export function resolveStorefrontContact(settings?: Partial<StoreSettingsRecord>) {
  const supportEmail = normalizeOptionalValue(settings?.support_email) || siteConfig.supportEmail;
  const phone = normalizeOptionalValue(settings?.support_phone) || siteConfig.phone;
  const shippingRegion = normalizeOptionalValue(settings?.shipping_region) || "United States only";

  return {
    supportEmail,
    phone,
    shippingRegion
  };
}

export function hasConfiguredEmailDelivery(settings?: Partial<StoreSettingsRecord>) {
  return Boolean(
    parseEnabledSetting(settings?.email_enabled) &&
      normalizeOptionalValue(settings?.smtp_host) &&
      normalizeOptionalValue(settings?.smtp_user) &&
      normalizeOptionalValue(settings?.smtp_pass) &&
      normalizeOptionalValue(settings?.email_from_address)
  );
}
