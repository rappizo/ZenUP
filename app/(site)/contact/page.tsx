import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { defaultOgImage } from "@/lib/seo";

type ContactPageProps = {
  searchParams: Promise<{ sent?: string }>;
};

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ZenUP for customer care, wholesale support, and product questions.",
  alternates: {
    canonical: "/contact"
  },
  keywords: [
    "contact ZenUP",
    "ZenUP customer support",
    "NAD+ supplement support",
    "ZenUP contact page"
  ],
  openGraph: {
    title: `Contact | ${siteConfig.title}`,
    description: "Contact ZenUP for customer care, wholesale support, and product questions.",
    url: `${siteConfig.url}/contact`,
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact | ${siteConfig.title}`,
    description: "Contact ZenUP for customer care, wholesale support, and product questions.",
    images: [defaultOgImage.url]
  }
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { sent } = await searchParams;

  return (
    <section className="section">
      <div className="container">
        <div className="contact-hero">
          <p className="eyebrow">Contact</p>
          <h1>We are here to help with orders, formula questions, and partnership requests.</h1>
          <p>
            Reach out if you need help reviewing the supplement facts, checking an order, or
            discussing wholesale and partnership opportunities.
          </p>
          <div className="page-hero__stats">
            <span className="pill">{siteConfig.supportEmail}</span>
            <span className="pill">{siteConfig.phone}</span>
            <span className="pill">US region support</span>
          </div>
        </div>

        {sent === "1" ? <p className="notice">Your message was received. We will be in touch soon.</p> : null}

        <div className="section cards-2">
          <div className="contact-card">
            <h3>Customer & wholesale support</h3>
            <p>
              Reach out for shipping questions, order support, ingredient questions, or retail and
              distribution inquiries.
            </p>
            <div className="site-footer__contact">
              <span>{siteConfig.supportEmail}</span>
              <span>{siteConfig.phone}</span>
              <span>Monday to Friday, 9 AM to 6 PM PT</span>
            </div>
          </div>
          <div className="contact-card">
            <h3>Send a message</h3>
            <p>Tell us what you need and our team will get back to you as soon as possible.</p>
            <form action="/api/contact" method="post" className="contact-form">
              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" required />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required />
              </div>
              <button type="submit" className="button button--primary">
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
