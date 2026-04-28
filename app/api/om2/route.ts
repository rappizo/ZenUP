import { handleOmbStepTwoSubmission, legacyOmFlowRoutes } from "@/lib/omb-flow";

export async function POST(request: Request) {
  return handleOmbStepTwoSubmission(request, legacyOmFlowRoutes);
}
