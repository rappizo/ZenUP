import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { syncEmailMarketingContact } from "@/lib/email-marketing";
import { compressOmbScreenshot } from "@/lib/omb-screenshot";
import {
  getOrderMatchPlatform,
  isHighRating,
  isOrderMatchPlatform,
  OMB_MIN_COMMENT_LENGTH,
  validateOrderId
} from "@/lib/order-match";

export type OmbFlowRoutes = {
  stepOnePage: string;
  stepTwoPage: string;
  stepThreePage: string;
  thankYouPage: string;
};

export const legacyOmFlowRoutes: OmbFlowRoutes = {
  stepOnePage: "/om",
  stepTwoPage: "/om2",
  stepThreePage: "/om3",
  thankYouPage: "/om2/thank-you"
};

export const storefrontOmbFlowRoutes: OmbFlowRoutes = {
  stepOnePage: "/omb",
  stepTwoPage: "/omb2",
  stepThreePage: "/omb3",
  thankYouPage: "/omb2/thank-you"
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildRelativeUrl(pathname: string, searchParams?: Record<string, string | undefined | null>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams || {})) {
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function redirectWithinFlow(
  request: Request,
  pathname: string,
  searchParams?: Record<string, string | undefined | null>
) {
  return NextResponse.redirect(new URL(buildRelativeUrl(pathname, searchParams), request.url), 303);
}

function isMissingReviewStepSubmittedAtColumn(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  const target = `${String(error.meta?.column || "")} ${error.message}`;
  return error.code === "P2022" && target.includes("reviewStepSubmittedAt");
}

export async function handleOmbStepOneSubmission(request: Request, routes: OmbFlowRoutes) {
  const formData = await request.formData();
  const requestedPlatform = String(formData.get("platform") || "").trim().toLowerCase();
  const orderId = String(formData.get("orderId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();

  if (!isOrderMatchPlatform(requestedPlatform)) {
    return redirectWithinFlow(request, routes.stepOnePage, { error: "platform" });
  }

  const platform = getOrderMatchPlatform(requestedPlatform);

  if (!orderId || !name || !email) {
    return redirectWithinFlow(request, routes.stepOnePage, {
      platform: platform.key,
      error: "missing"
    });
  }

  if (!emailPattern.test(email)) {
    return redirectWithinFlow(request, routes.stepOnePage, {
      platform: platform.key,
      error: "email"
    });
  }

  if (!validateOrderId(platform.key, orderId)) {
    return redirectWithinFlow(request, routes.stepOnePage, {
      platform: platform.key,
      error: "order-id"
    });
  }

  const [existingOrderClaim, existingEmailClaim] = await prisma.$transaction([
    prisma.ombClaim.findFirst({
      where: {
        completedAt: {
          not: null
        },
        orderId
      },
      select: { id: true }
    }),
    prisma.ombClaim.findFirst({
      where: {
        completedAt: {
          not: null
        },
        email
      },
      select: { id: true }
    })
  ]);

  if (existingOrderClaim) {
    return redirectWithinFlow(request, routes.stepOnePage, {
      platform: platform.key,
      error: "duplicate-order"
    });
  }

  if (existingEmailClaim) {
    return redirectWithinFlow(request, routes.stepOnePage, {
      platform: platform.key,
      error: "duplicate-email"
    });
  }

  const claim = await prisma.ombClaim.create({
    data: {
      platformKey: platform.key,
      platformLabel: platform.label,
      orderId,
      name,
      email,
      phone: phone || null
    }
  });

  try {
    await syncEmailMarketingContact({
      email,
      audienceType: "CUSTOMERS"
    });
  } catch (error) {
    console.error("OMB email marketing sync failed:", error);
  }

  return redirectWithinFlow(request, routes.stepTwoPage, {
    platform: platform.key,
    claim: claim.id
  });
}

export async function handleOmbStepTwoSubmission(request: Request, routes: OmbFlowRoutes) {
  const formData = await request.formData();
  const claimId = String(formData.get("claimId") || "").trim();
  const purchasedProduct = String(formData.get("purchasedProduct") || "").trim();
  const rating = Number.parseInt(String(formData.get("rating") || "").trim(), 10);
  const commentText = String(formData.get("commentText") || "").trim();

  const claim = claimId
    ? await prisma.ombClaim.findUnique({
        where: { id: claimId }
      })
    : null;

  if (!claim) {
    return redirectWithinFlow(request, routes.stepTwoPage, { error: "claim" });
  }

  const platform = getOrderMatchPlatform(claim.platformKey);
  const product = await prisma.product.findFirst({
    where: {
      productShortName: purchasedProduct
    },
    select: {
      productShortName: true,
      amazonAsin: true
    }
  });

  if (!product?.productShortName) {
    return redirectWithinFlow(request, routes.stepTwoPage, {
      claim: claim.id,
      platform: platform.key,
      error: "product"
    });
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return redirectWithinFlow(request, routes.stepTwoPage, {
      claim: claim.id,
      platform: platform.key,
      error: "rating"
    });
  }

  if (commentText.length < OMB_MIN_COMMENT_LENGTH) {
    return redirectWithinFlow(request, routes.stepTwoPage, {
      claim: claim.id,
      platform: platform.key,
      error: "comment"
    });
  }

  const reviewDestinationUrl =
    platform.key === "amazon"
      ? product.amazonAsin
        ? `https://www.amazon.com/review/create-review/?asin=${encodeURIComponent(product.amazonAsin)}`
        : null
      : platform.outboundUrl;

  const highRating = isHighRating(rating);

  if (!highRating) {
    const [existingOrderClaim, existingEmailClaim] = await prisma.$transaction([
      prisma.ombClaim.findFirst({
        where: {
          id: {
            not: claim.id
          },
          completedAt: {
            not: null
          },
          orderId: claim.orderId
        },
        select: { id: true }
      }),
      prisma.ombClaim.findFirst({
        where: {
          id: {
            not: claim.id
          },
          completedAt: {
            not: null
          },
          email: claim.email
        },
        select: { id: true }
      })
    ]);

    if (existingOrderClaim) {
      return redirectWithinFlow(request, routes.stepOnePage, {
        platform: platform.key,
        error: "duplicate-order"
      });
    }

    if (existingEmailClaim) {
      return redirectWithinFlow(request, routes.stepOnePage, {
        platform: platform.key,
        error: "duplicate-email"
      });
    }
  }

  try {
    await prisma.ombClaim.update({
      where: { id: claim.id },
      data: {
        purchasedProduct: product.productShortName,
        reviewRating: rating,
        commentText,
        reviewDestinationUrl,
        reviewStepSubmittedAt: new Date(),
        screenshotName: null,
        screenshotMimeType: null,
        screenshotBase64: null,
        screenshotBytes: null,
        extraBottleAddress: null,
        completedAt: highRating ? null : new Date()
      }
    });
  } catch (error) {
    if (!isMissingReviewStepSubmittedAtColumn(error)) {
      throw error;
    }

    await prisma.ombClaim.update({
      where: { id: claim.id },
      data: {
        purchasedProduct: product.productShortName,
        reviewRating: rating,
        commentText,
        reviewDestinationUrl,
        screenshotName: null,
        screenshotMimeType: null,
        screenshotBase64: null,
        screenshotBytes: null,
        extraBottleAddress: null,
        completedAt: highRating ? null : new Date()
      }
    });
  }

  if (highRating) {
    return redirectWithinFlow(request, routes.stepThreePage, {
      claim: claim.id
    });
  }

  return redirectWithinFlow(request, routes.thankYouPage, {
    claim: claim.id
  });
}

export async function handleOmbStepThreeSubmission(request: Request, routes: OmbFlowRoutes) {
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
    return redirectWithinFlow(request, routes.stepOnePage, { error: "claim" });
  }

  if (claim.completedAt) {
    return redirectWithinFlow(request, routes.thankYouPage, { claim: claim.id });
  }

  if (!claim.reviewRating || !isHighRating(claim.reviewRating)) {
    return redirectWithinFlow(request, routes.thankYouPage, { claim: claim.id });
  }

  const platform = getOrderMatchPlatform(claim.platformKey);

  if (!extraBottleAddress) {
    return redirectWithinFlow(request, routes.stepThreePage, {
      claim: claim.id,
      error: "address"
    });
  }

  const [existingOrderClaim, existingEmailClaim] = await prisma.$transaction([
    prisma.ombClaim.findFirst({
      where: {
        id: {
          not: claim.id
        },
        completedAt: {
          not: null
        },
        orderId: claim.orderId
      },
      select: { id: true }
    }),
    prisma.ombClaim.findFirst({
      where: {
        id: {
          not: claim.id
        },
        completedAt: {
          not: null
        },
        email: claim.email
      },
      select: { id: true }
    })
  ]);

  if (existingOrderClaim) {
    return redirectWithinFlow(request, routes.stepOnePage, {
      platform: claim.platformKey,
      error: "duplicate-order"
    });
  }

  if (existingEmailClaim) {
    return redirectWithinFlow(request, routes.stepOnePage, {
      platform: claim.platformKey,
      error: "duplicate-email"
    });
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
      return redirectWithinFlow(request, routes.stepThreePage, {
        claim: claim.id,
        error: "image-required"
      });
    }

    try {
      screenshotPayload = await compressOmbScreenshot(screenshot);
    } catch (error) {
      const message = error instanceof Error ? error.message : "image-type";
      return redirectWithinFlow(request, routes.stepThreePage, {
        claim: claim.id,
        error: message
      });
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

  return redirectWithinFlow(request, routes.thankYouPage, {
    claim: claim.id
  });
}
