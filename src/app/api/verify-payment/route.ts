import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getRazorpayKeySecret } from "@/lib/razorpay";

export async function POST(request: Request) {
  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  let expectedSignature: string;
  try {
    expectedSignature = createHmac("sha256", getRazorpayKeySecret())
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
  } catch {
    return NextResponse.json(
      { error: "Payment verification is not configured" },
      { status: 500 }
    );
  }

  const expected = Buffer.from(expectedSignature, "hex");
  const actual = Buffer.from(razorpay_signature, "hex");

  const isValid =
    expected.length === actual.length && timingSafeEqual(expected, actual);

  if (!isValid) {
    return NextResponse.json(
      { success: false, error: "Signature verification failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
