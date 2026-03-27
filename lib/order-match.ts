export type OrderMatchPlatform = "amazon" | "tiktok" | "walmart";

export type OrderMatchPlatformConfig = {
  key: OrderMatchPlatform;
  label: string;
  formKey: string;
  heroTitle: string;
  description: string;
  orderIdLabel: string;
  orderIdPlaceholder: string;
  validationHint: string;
};

export const orderMatchPlatforms: OrderMatchPlatformConfig[] = [
  {
    key: "amazon",
    label: "Amazon",
    formKey: "amazon-order-match",
    heroTitle: "Amazon order verification",
    description:
      "Use the Amazon form when the customer order was placed through Amazon and you want to verify the order before the next step.",
    orderIdLabel: "Amazon Order ID",
    orderIdPlaceholder: "1xx-...",
    validationHint:
      "Amazon order IDs must follow 1xx-xxxxxxx-xxxxxxx and start with 1."
  },
  {
    key: "tiktok",
    label: "TikTok",
    formKey: "tiktok-order-match",
    heroTitle: "TikTok Shop order verification",
    description:
      "Use the TikTok form for TikTok Shop orders. The order ID must be an 18-digit number and follow the TikTok format.",
    orderIdLabel: "TikTok Order ID",
    orderIdPlaceholder: "5xxx...",
    validationHint:
      "TikTok order IDs must be 18 digits and start with 5."
  },
  {
    key: "walmart",
    label: "Walmart",
    formKey: "walmart-order-match",
    heroTitle: "Walmart order verification",
    description:
      "Use the Walmart form when the order came from Walmart. Walmart order IDs can include symbols in the middle but must still match the store format.",
    orderIdLabel: "Walmart Order ID",
    orderIdPlaceholder: "200...",
    validationHint:
      "Walmart order IDs must start with 200 and be 15 or 16 characters long."
  }
] as const;

export function getOrderMatchPlatform(platform: string | null | undefined) {
  return orderMatchPlatforms.find((item) => item.key === platform) ?? orderMatchPlatforms[0];
}

export function isOrderMatchPlatform(platform: string | null | undefined): platform is OrderMatchPlatform {
  return orderMatchPlatforms.some((item) => item.key === platform);
}

export function validateOrderId(platform: OrderMatchPlatform, rawOrderId: string) {
  const orderId = rawOrderId.trim();

  switch (platform) {
    case "amazon":
      return /^1\d{2}-\d{7}-\d{7}$/.test(orderId);
    case "tiktok":
      return /^5\d{17}$/.test(orderId);
    case "walmart":
      return /^200.{12,13}$/.test(orderId);
    default:
      return false;
  }
}

export function getOrderMatchErrorMessage(error: string | null | undefined) {
  if (error === "missing") {
    return "Please complete Order ID, Name, Email, and Phone before continuing.";
  }

  if (error === "email") {
    return "Please enter a valid email address before continuing.";
  }

  if (error === "platform") {
    return "Please choose Amazon, TikTok, or Walmart before continuing.";
  }

  if (error === "order-id") {
    return "The order ID does not match the selected platform format. Please recheck it and try again.";
  }

  return null;
}
