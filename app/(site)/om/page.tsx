import type { Metadata } from "next";
import Link from "next/link";
import {
  getOrderMatchErrorMessage,
  getOrderMatchPlatform,
  orderMatchPlatforms
} from "@/lib/order-match";

type OrderMatchPageProps = {
  searchParams: Promise<{ platform?: string; error?: string }>;
};

export const metadata: Metadata = {
  title: "Order Match",
  description: "Verify Amazon, TikTok, and Walmart order IDs before continuing to the next step."
};

export default async function OrderMatchPage({ searchParams }: OrderMatchPageProps) {
  const params = await searchParams;
  const activePlatform = getOrderMatchPlatform(params.platform);
  const errorMessage = getOrderMatchErrorMessage(params.error);

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="eyebrow">Order Match</p>
          <h1>Choose the sales channel, verify the order format, and continue to the next step.</h1>
          <p>
            Pick Amazon, TikTok, or Walmart, then submit the matching order details. If the order
            format is valid, we will move you straight to the next screen.
          </p>
          <div className="page-hero__stats">
            <span className="pill">Amazon</span>
            <span className="pill">TikTok Shop</span>
            <span className="pill">Walmart</span>
          </div>
        </div>

        {errorMessage ? <p className="notice">{errorMessage}</p> : null}

        <div className="section om-layout">
          <div className="om-platforms">
            {orderMatchPlatforms.map((platform) => (
              <article
                key={platform.key}
                className={`om-platform-card ${platform.key === activePlatform.key ? "om-platform-card--active" : ""}`}
              >
                <p className="eyebrow">{platform.label}</p>
                <h3>{platform.heroTitle}</h3>
                <p>{platform.description}</p>
                <ul className="detail-list">
                  <li>{platform.validationHint}</li>
                  <li>Required fields: Order ID, Name, Email, Phone</li>
                </ul>
                <Link
                  href={`/om?platform=${platform.key}`}
                  className={`button ${platform.key === activePlatform.key ? "button--primary" : "button--secondary"}`}
                >
                  Use {platform.label} form
                </Link>
              </article>
            ))}
          </div>

          <div className="admin-form om-form-card">
            <div className="section-heading">
              <p className="section-heading__eyebrow">{activePlatform.label} form</p>
              <h2>{activePlatform.heroTitle}</h2>
              <p className="section-heading__description">{activePlatform.description}</p>
            </div>

            <form action="/api/om" method="post" className="contact-form">
              <input type="hidden" name="platform" value={activePlatform.key} />
              <div className="field">
                <label htmlFor="order-id">{activePlatform.orderIdLabel}</label>
                <input
                  id="order-id"
                  name="orderId"
                  placeholder={activePlatform.orderIdPlaceholder}
                  required
                />
                <p className="form-note">{activePlatform.validationHint}</p>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="om-name">Name</label>
                  <input id="om-name" name="name" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="om-email">Email</label>
                  <input id="om-email" name="email" type="email" autoComplete="email" required />
                </div>
              </div>

              <div className="field">
                <label htmlFor="om-phone">Phone</label>
                <input id="om-phone" name="phone" type="tel" autoComplete="tel" required />
              </div>

              <button type="submit" className="button button--primary">
                Continue to the next step
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
