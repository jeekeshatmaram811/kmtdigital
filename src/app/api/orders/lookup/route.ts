import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

export async function POST(request: Request) {
  let body: { orderNumber?: string; contact?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderNumber = body.orderNumber?.trim();
  const contact = body.contact?.trim();

  if (!orderNumber || !contact) {
    return NextResponse.json(
      { error: "Order number and email/phone are required" },
      { status: 400 }
    );
  }

  const order = await getPrisma().order.findFirst({
    where: {
      orderNumber: { equals: orderNumber, mode: "insensitive" },
      OR: [{ customerEmail: { equals: contact, mode: "insensitive" } }, { customerPhone: contact }],
    },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    shippingAddress: order.shippingAddress,
    shippingCity: order.shippingCity,
    shippingState: order.shippingState,
    shippingPincode: order.shippingPincode,
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
  });
}
