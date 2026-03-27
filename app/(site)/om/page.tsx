import type { Metadata } from "next";
import { OrderMatchPanel } from "@/components/order-match/order-match-panel";
import { getOrderMatchErrorMessage, getOrderMatchPlatform } from "@/lib/order-match";

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
        {errorMessage ? <p className="notice">{errorMessage}</p> : null}

        <div className="section om-section">
          <OrderMatchPanel initialPlatform={activePlatform.key} />
        </div>
      </div>
    </section>
  );
}
