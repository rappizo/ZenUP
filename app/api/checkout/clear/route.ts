import { NextResponse } from "next/server";
import { clearCheckoutDraft } from "@/lib/checkout-draft";

export async function POST() {
  await clearCheckoutDraft();
  return NextResponse.json({ cleared: true });
}
