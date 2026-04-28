import { handleOmbStepThreeSubmission, storefrontOmbFlowRoutes } from "@/lib/omb-flow";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleOmbStepThreeSubmission(request, storefrontOmbFlowRoutes);
}
