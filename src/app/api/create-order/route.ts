import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  let body: { amount?: number; currency?: string; receipt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { amount, currency = "INR", receipt } = body;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 100) {
    return NextResponse.json(
      { error: "amount must be a number of at least 100 paise" },
      { status: 400 }
    );
  }

  try {
    const order = await getRazorpay().orders.create({
      amount: Math.round(amount),
      currency,
      receipt: receipt ?? `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode)
        : undefined;

    if (statusCode === 401) {
      return NextResponse.json(
        { error: "Razorpay authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
