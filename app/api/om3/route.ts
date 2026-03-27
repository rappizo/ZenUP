import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrderMatchPlatform, isHighRating } from "@/lib/order-match";
import { compressOmbScreenshot } from "@/lib/omb-screenshot";

export const runtime = "nodejs";

function redirectWithError(request: Request, claimId: string, error: string) {
  return NextResponse.redirect(new URL(`/om3?claim=${claimId}&error=${error}`, request.url), 303);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const claimId = String(formData.get("claimId") || "").trim();
  const extraBottleAddress = String(formData.get("extraBottleAddress") || "").trim();
  const screenshot = formData.get("screenshot");

  const claim = claimId
    ? await prisma.ombClaim.findUnique({
        where: { id: claimId }
      })
    : null;

  if (!claim) {
    return NextResponse.redirect(new URL("/om?error=claim", request.url), 303);
  }

  if (!claim.reviewRating || !isHighRating(claim.reviewRating)) {
    return NextResponse.redirect(new URL(`/om2/thank-you?claim=${claim.id}`, request.url), 303);
  }

  const platform = getOrderMatchPlatform(claim.platformKey);

  if (!extraBottleAddress) {
    return redirectWithError(request, claim.id, "address");
  }

  let screenshotPayload:
    | {
        name: string;
        mimeType: string;
        base64: string;
        bytes: number;
      }
    | undefined;

  if (platform.key !== "amazon") {
    if (!(screenshot instanceof File) || screenshot.size <= 0) {
      return redirectWithError(request, claim.id, "image-required");
    }

    try {
      screenshotPayload = await compressOmbScreenshot(screenshot);
    } catch (error) {
      const message = error instanceof Error ? error.message : "image-type";
      return redirectWithError(request, claim.id, message);
    }
  }

  await prisma.ombClaim.update({
    where: { id: claim.id },
    data: {
      screenshotName: screenshotPayload?.name ?? null,
      screenshotMimeType: screenshotPayload?.mimeType ?? null,
      screenshotBase64: screenshotPayload?.base64 ?? null,
      screenshotBytes: screenshotPayload?.bytes ?? null,
      extraBottleAddress,
      completedAt: new Date()
    }
  });

  return NextResponse.redirect(new URL(`/om2/thank-you?claim=${claim.id}`, request.url), 303);
}
