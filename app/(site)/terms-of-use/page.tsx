import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the ZenUP Terms of Use for website access, orders, content usage, and account responsibilities.",
  alternates: {
    canonical: "/terms-of-use"
  }
};

const sections = [
  {
    title: "Using the website",
    paragraphs: [
      "By accessing or using ZenUP, you agree to use the website only for lawful purposes and in a way that does not interfere with the experience of other visitors or customers.",
      "We may update, adjust, or remove site content, products, promotions, or features at any time as the business evolves."
    ]
  },
  {
    title: "Product information and availability",
    paragraphs: [
      "We do our best to present product details, ingredients, pricing, and inventory as accurately as possible. Even so, occasional errors or availability changes may occur.",
      "We reserve the right to correct product information, update pricing, cancel unavailable orders, or limit quantities when necessary."
    ]
  },
  {
    title: "Accounts and customer responsibilities",
    paragraphs: [
      "If you create an account, you are responsible for keeping your login information secure and for making sure the information connected to your account and orders is accurate and current.",
      "You agree not to misuse the site, attempt unauthorized access, upload harmful material, or interfere with checkout, reviews, forms, or account features."
    ]
  },
  {
    title: "Intellectual property",
    paragraphs: [
      "All content on ZenUP, including product descriptions, page copy, images, branding, design, and site materials, belongs to ZenUP or its licensors unless otherwise stated.",
      "You may not copy, reproduce, distribute, or commercially reuse site content without written permission."
    ]
  },
  {
    title: "Supplement notice and contact",
    paragraphs: [
      "Information on this website is provided for general educational and shopping purposes only. Product statements on the site are not intended as medical advice and do not replace guidance from a qualified healthcare professional.",
      "If you have questions about these Terms of Use, please contact our support team through the contact page."
    ]
  }
] as const;

const highlights = [
  {
    title: "Website access",
    description: "Use the site lawfully and do not interfere with other shoppers or site functions."
  },
  {
    title: "Product accuracy",
    description: "We aim for accurate listings but may correct details, pricing, or availability when needed."
  },
  {
    title: "Brand content",
    description: "Site copy, imagery, design, and trademarks remain protected brand property."
  }
] as const;

export default function TermsOfUsePage() {
  return (
    <PolicyPage
      eyebrow="Terms Of Use"
      title="The terms that apply when you browse, shop, or use the ZenUP website."
      description="These Terms of Use explain the basic rules for using ZenUP, placing orders, creating an account, and interacting with site content and customer tools."
      stats={["Website use rules", "Applies to browsing and shopping", "Updated as the business evolves"]}
      sections={[...sections]}
      highlights={[...highlights]}
    />
  );
}
