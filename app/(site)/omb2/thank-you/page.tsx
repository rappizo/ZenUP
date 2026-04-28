import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "OMB Claim Submitted",
  description: "Thank you for completing your ZenUP OMB claim."
};

export default function OmbClaimThankYouPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="page-hero om-thank-you">
          <p className="eyebrow">Thank you</p>
          <h1>Your OMB claim has been submitted and is ready for review.</h1>
          <p>
            Our team will review the order, review proof, and shipping details before moving the
            extra bottle request forward.
          </p>
          <div className="stack-row">
            <ButtonLink href="/" variant="primary">
              Back home
            </ButtonLink>
            <ButtonLink href="/omb" variant="secondary">
              Submit another claim
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
