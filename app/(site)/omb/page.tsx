import type { Metadata } from "next";
import { OrderMatchPanel } from "@/components/order-match/order-match-panel";
import { getOrderMatchErrorMessage, getOrderMatchPlatform } from "@/lib/order-match";

type OmbPageProps = {
  searchParams: Promise<{ platform?: string; error?: string }>;
};

export const metadata: Metadata = {
  title: "OMB Claim",
  description: "Verify Amazon, TikTok Shop, or Walmart order details before continuing your ZenUP OMB claim."
};

export default async function OmbPage({ searchParams }: OmbPageProps) {
  const params = await searchParams;
  const activePlatform = getOrderMatchPlatform(params.platform);
  const errorMessage = getOrderMatchErrorMessage(params.error);

  return (
    <section className="section">
      <div className="container">
        {errorMessage ? <p className="notice">{errorMessage}</p> : null}

        <div className="section om-section">
          <OrderMatchPanel
            initialPlatform={activePlatform.key}
            submitAction="/api/omb"
          />
        </div>
      </div>
    </section>
  );
}
