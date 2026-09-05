import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { getPrisma } from "@/lib/db";

type CreateOrderInput = {
  items?: { productId: string; quantity: number }[];
  customer?: { name: string; email: string; phone: string };
  shipping?: { address: string; city: string; state: string; pincode: string };
};

function generateOrderNumber() {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `KMT${Date.now().toString(36).toUpperCase()}${random}`;
}

export async function POST(request: Request) {
  let body: CreateOrderInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { items, customer, shipping } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!customer?.name || !customer?.email || !customer?.phone) {
    return NextResponse.json({ error: "Customer details are required" }, { status: 400 });
  }
  if (!shipping?.address || !shipping?.city || !shipping?.state || !shipping?.pincode) {
    return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
  }

  const prisma = getPrisma();

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productById.get(item.productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "One or more items are no longer available" },
        { status: 400 }
      );
    }
    if (item.quantity < 1 || item.quantity > product.stock) {
      return NextResponse.json(
        { error: `Not enough stock for "${product.name}"` },
        { status: 400 }
      );
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = productById.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const freeShippingThreshold = settings?.freeShippingThreshold ?? null;
  const standardShippingFee = settings?.standardShippingFee ?? 0;
  const shippingFee =
    freeShippingThreshold !== null && subtotal >= freeShippingThreshold
      ? 0
      : standardShippingFee;

  const total = subtotal + shippingFee;

  if (total * 100 < 100) {
    return NextResponse.json({ error: "Order total is too low" }, { status: 400 });
  }

  const orderNumber = generateOrderNumber();

  try {
    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: orderNumber,
    });

    await prisma.order.create({
      data: {
        orderNumber,
        status: "PENDING",
        razorpayOrderId: razorpayOrder.id,
        subtotal,
        shippingFee,
        total,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingPincode: shipping.pincode,
        items: {
          create: items.map((item) => {
            const product = productById.get(item.productId)!;
            return {
              productId: product.id,
              productName: product.name,
              productImage: product.images[0]?.url,
              unitPrice: product.price,
              quantity: item.quantity,
              lineTotal: product.price * item.quantity,
            };
          }),
        },
      },
    });

    return NextResponse.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      orderNumber,
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
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
