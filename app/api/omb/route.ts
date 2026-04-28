import { handleOmbStepOneSubmission, storefrontOmbFlowRoutes } from "@/lib/omb-flow";

export async function POST(request: Request) {
  return handleOmbStepOneSubmission(request, storefrontOmbFlowRoutes);
}
