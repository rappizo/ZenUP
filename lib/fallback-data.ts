import type {
  BeautyPostRecord,
  CustomerRecord,
  DashboardSummary,
  OrderRecord,
  ProductRecord,
  ProductReviewRecord,
  RewardEntryRecord,
  StoreSettingsRecord
} from "@/lib/types";
import { getDefaultProductImageUrl } from "@/lib/product-media";
import {
  samplePosts,
  sampleProducts,
  sampleReviews,
  sampleStoreSettings
} from "@/lib/sample-store-data";

const zenupImage =
  getDefaultProductImageUrl("zenup-nad-plus-nicotinamide-riboside") ?? "/icon.svg";

export const fallbackProducts: ProductRecord[] = sampleProducts;

export const fallbackPosts: BeautyPostRecord[] = samplePosts;

export const fallbackCustomers: CustomerRecord[] = [
  {
    id: "cus_daniel",
    email: "daniel@example.com",
    firstName: "Daniel",
    lastName: "Reed",
    hasPassword: false,
    passwordSetAt: null,
    lastLoginAt: null,
    marketingOptIn: true,
    loyaltyPoints: 69,
    totalSpentCents: 6900,
    orderCount: 1,
    reviewCount: 1,
    createdAt: new Date("2026-03-26T09:00:00.000Z"),
    updatedAt: new Date("2026-03-29T09:00:00.000Z")
  },
  {
    id: "cus_marcus",
    email: "marcus@example.com",
    firstName: "Marcus",
    lastName: "Taylor",
    hasPassword: false,
    passwordSetAt: null,
    lastLoginAt: null,
    marketingOptIn: true,
    loyaltyPoints: 138,
    totalSpentCents: 13800,
    orderCount: 2,
    reviewCount: 0,
    createdAt: new Date("2026-03-24T09:00:00.000Z"),
    updatedAt: new Date("2026-03-29T09:00:00.000Z")
  }
];

export const fallbackOrders: OrderRecord[] = [
  {
    id: "ord_2002",
    orderNumber: "ZEN-2002",
    email: "marcus@example.com",
    status: "PAID",
    fulfillmentStatus: "SHIPPED",
    currency: "USD",
    subtotalCents: 13800,
    discountCents: 0,
    shippingCents: 0,
    taxCents: 0,
    totalCents: 13800,
    pointsEarned: 138,
    couponCode: null,
    couponId: null,
    shippingName: "Marcus Taylor",
    shippingAddress1: "1480 Sunset Blvd",
    shippingAddress2: null,
    shippingCity: "Los Angeles",
    shippingState: "CA",
    shippingPostalCode: "90026",
    shippingCountry: "US",
    billingName: "Marcus Taylor",
    billingAddress1: "1480 Sunset Blvd",
    billingAddress2: null,
    billingCity: "Los Angeles",
    billingState: "CA",
    billingPostalCode: "90026",
    billingCountry: "US",
    notes: null,
    stripeCheckoutId: "cs_test_2002",
    stripePaymentIntentId: "pi_test_2002",
    customerId: "cus_marcus",
    createdAt: new Date("2026-03-28T10:00:00.000Z"),
    updatedAt: new Date("2026-03-29T10:00:00.000Z"),
    items: [
      {
        id: "item_2002_a",
        name: "ZenUP NAD+ Nicotinamide Riboside 1100mg",
        slug: "zenup-nad-plus-nicotinamide-riboside",
        quantity: 2,
        unitPriceCents: 6900,
        lineTotalCents: 13800,
        imageUrl: zenupImage
      }
    ]
  },
  {
    id: "ord_2001",
    orderNumber: "ZEN-2001",
    email: "daniel@example.com",
    status: "PAID",
    fulfillmentStatus: "PROCESSING",
    currency: "USD",
    subtotalCents: 6900,
    discountCents: 0,
    shippingCents: 0,
    taxCents: 0,
    totalCents: 6900,
    pointsEarned: 69,
    couponCode: null,
    couponId: null,
    shippingName: "Daniel Reed",
    shippingAddress1: "77 Spring St",
    shippingAddress2: "Unit 4A",
    shippingCity: "New York",
    shippingState: "NY",
    shippingPostalCode: "10012",
    shippingCountry: "US",
    billingName: "Daniel Reed",
    billingAddress1: "77 Spring St",
    billingAddress2: "Unit 4A",
    billingCity: "New York",
    billingState: "NY",
    billingPostalCode: "10012",
    billingCountry: "US",
    notes: null,
    stripeCheckoutId: "cs_test_2001",
    stripePaymentIntentId: "pi_test_2001",
    customerId: "cus_daniel",
    createdAt: new Date("2026-03-27T10:00:00.000Z"),
    updatedAt: new Date("2026-03-27T10:00:00.000Z"),
    items: [
      {
        id: "item_2001_a",
        name: "ZenUP NAD+ Nicotinamide Riboside 1100mg",
        slug: "zenup-nad-plus-nicotinamide-riboside",
        quantity: 1,
        unitPriceCents: 6900,
        lineTotalCents: 6900,
        imageUrl: zenupImage
      }
    ]
  }
];

export const fallbackRewards: RewardEntryRecord[] = [
  {
    id: "reward_1",
    type: "EARNED",
    points: 69,
    note: "Paid order ZEN-2001",
    orderId: "ord_2001",
    customerId: "cus_daniel",
    customerEmail: "daniel@example.com",
    createdAt: new Date("2026-03-27T10:05:00.000Z")
  },
  {
    id: "reward_2",
    type: "EARNED",
    points: 138,
    note: "Paid order ZEN-2002",
    orderId: "ord_2002",
    customerId: "cus_marcus",
    customerEmail: "marcus@example.com",
    createdAt: new Date("2026-03-28T10:05:00.000Z")
  }
];

export const fallbackReviews: ProductReviewRecord[] = sampleReviews;

export const fallbackSettings: StoreSettingsRecord = sampleStoreSettings;

export const fallbackDashboardSummary: DashboardSummary = {
  activeProductCount: fallbackProducts.filter((product) => product.status === "ACTIVE").length,
  publishedPostCount: fallbackPosts.filter((post) => post.published).length,
  customerCount: fallbackCustomers.length,
  orderCount: fallbackOrders.length,
  paidRevenueCents: fallbackOrders
    .filter((order) => order.status === "PAID" || order.status === "FULFILLED")
    .reduce((sum, order) => sum + order.totalCents, 0),
  pointsIssued: fallbackRewards.reduce((sum, reward) => sum + Math.max(reward.points, 0), 0),
  completedOmbClaimsToday: 0,
  contactFormTodayCount: 0,
  contactFormUnhandledCount: 0,
  lowInventoryProducts: fallbackProducts.filter((product) => product.inventory < 125),
  recentOrders: fallbackOrders
};
