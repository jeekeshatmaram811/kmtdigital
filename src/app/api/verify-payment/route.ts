import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getRazorpayKeySecret } from "@/lib/razorpay";
import { getPrisma } from "@/lib/db";

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

  const prisma = getPrisma();

  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { razorpayOrderId: razorpay_order_id },
        include: { items: true },
      });

      if (!existing) {
        throw new Error("ORDER_NOT_FOUND");
      }

      if (existing.status === "PAID") {
        return existing;
      }

      for (const item of existing.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      return tx.order.update({
        where: { id: existing.id },
        data: {
          status: "PAID",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Could not finalize order" },
      { status: 500 }
    );
  }
}
