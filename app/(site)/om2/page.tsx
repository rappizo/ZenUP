import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OmbClaimStepTwoForm } from "@/components/order-match/omb-claim-step-two-form";
import { getOrderMatchPlatform, getOmbStepTwoErrorMessage } from "@/lib/order-match";
import { prisma } from "@/lib/db";
import { getOmbSelectableProducts } from "@/lib/queries";

type OrderMatchStepTwoPageProps = {
  searchParams: Promise<{ platform?: string; claim?: string; status?: string; error?: string }>;
};

export const metadata: Metadata = {
  title: "OMB Claim Step 2",
  description: "Choose your purchased ZenUP product and share your review details for the OMB claim."
};

export default async function OrderMatchStepTwoPage({
  searchParams
}: OrderMatchStepTwoPageProps) {
  const params = await searchParams;
  const claimId = params.claim || "";

  if (!claimId) {
    redirect("/om");
  }

  const claim = await prisma.ombClaim.findUnique({
    where: { id: claimId }
  });

  if (!claim) {
    redirect("/om");
  }

  const [platform, productOptions] = await Promise.all([
    Promise.resolve(getOrderMatchPlatform(claim.platformKey)),
    getOmbSelectableProducts()
  ]);
  const errorMessage = getOmbStepTwoErrorMessage(params.error);

  return (
    <section className="section">
      <div className="container">
        {errorMessage ? <p className="notice">{errorMessage}</p> : null}

        <div className="section om-section">
          <OmbClaimStepTwoForm
            claimId={claim.id}
            platformKey={platform.key}
            platformLabel={claim.platformLabel}
            orderId={claim.orderId}
            name={claim.name}
            email={claim.email}
            phone={claim.phone}
            submitAction="/api/om2"
            productOptions={productOptions.map((product) => ({
              id: product.id,
              name: product.name,
              shortName: product.productShortName || product.name,
              amazonAsin: product.amazonAsin
            }))}
          />
        </div>
      </div>
    </section>
  );
}
