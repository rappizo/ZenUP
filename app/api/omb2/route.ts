import { handleOmbStepTwoSubmission, storefrontOmbFlowRoutes } from "@/lib/omb-flow";

export async function POST(request: Request) {
  return handleOmbStepTwoSubmission(request, storefrontOmbFlowRoutes);
}
