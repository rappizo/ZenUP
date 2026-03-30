const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const siteConfig = {
  name: "ZenUP",
  url: defaultSiteUrl,
  title: "ZenUP",
  description:
    "Professional NAD+ nutrition built around Nicotinamide Riboside, Quercetin Phytosome, Resveratrol, and CoQ10 for a focused healthy-aging routine.",
  accentColor: "#0f6a35",
  supportEmail: "support@zenup.com",
  phone: "+1 (213) 555-0186",
  nav: [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
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
      { href: "/shop", label: "All Products" },
      {
        href: "/shop/zenup-nad-plus-nicotinamide-riboside",
        label: "ZenUP NAD+"
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
