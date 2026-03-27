import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { getOrderMatchPlatform } from "@/lib/order-match";

type OrderMatchStepTwoPageProps = {
  searchParams: Promise<{ platform?: string; submission?: string }>;
};

export const metadata: Metadata = {
  title: "Order Match Step 2",
  description: "Verified order details and ready for the next order-match step."
};

export default async function OrderMatchStepTwoPage({
  searchParams
}: OrderMatchStepTwoPageProps) {
  const params = await searchParams;
  const platform = getOrderMatchPlatform(params.platform);

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="eyebrow">Order Match / Step 2</p>
          <h1>{platform.label} order format confirmed.</h1>
          <p>
            The order ID passed validation and the submission has been recorded. This screen is
            ready for the next step once you share the `/om2` requirements.
          </p>
          <div className="page-hero__stats">
            <span className="pill">{platform.label}</span>
            {params.submission ? <span className="pill">Submission saved</span> : null}
          </div>
        </div>

        <div className="section cards-2">
          <section className="contact-card">
            <h3>Current status</h3>
            <p>
              Validation is complete. The submission now lives in the admin Form Submissions area
              under the matching marketplace form.
            </p>
          </section>
          <section className="contact-card">
            <h3>Next build step</h3>
            <p>
              Share the exact `/om2` flow you want and we can plug it directly into this verified
              handoff without changing the validation page again.
            </p>
            <ButtonLink href="/om" variant="secondary">
              Back to order match
            </ButtonLink>
          </section>
        </div>
      </div>
    </section>
  );
}
