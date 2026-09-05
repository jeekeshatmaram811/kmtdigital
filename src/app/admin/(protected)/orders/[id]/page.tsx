import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getPrisma().order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Order {order.orderNumber}
        </h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Customer</h2>
          <p className="text-sm text-muted">{order.customerName}</p>
          <p className="text-sm text-muted">{order.customerEmail}</p>
          <p className="text-sm text-muted">{order.customerPhone}</p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Shipping Address
          </h2>
          <p className="text-sm text-muted">{order.shippingAddress}</p>
          <p className="text-sm text-muted">
            {order.shippingCity}, {order.shippingState} {order.shippingPincode}
          </p>
          <p className="text-sm text-muted">{order.shippingCountry}</p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 sm:col-span-2">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Payment</h2>
          <p className="text-sm text-muted">
            Razorpay Order ID: {order.razorpayOrderId ?? "—"}
          </p>
          <p className="text-sm text-muted">
            Razorpay Payment ID: {order.razorpayPaymentId ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Unit Price</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{item.productName}</td>
                <td className="px-4 py-3 text-muted">{formatPrice(item.unitPrice)}</td>
                <td className="px-4 py-3 text-muted">{item.quantity}</td>
                <td className="px-4 py-3 text-foreground">
                  {formatPrice(item.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-end gap-1 text-sm">
        <p className="text-muted">Subtotal: {formatPrice(order.subtotal)}</p>
        <p className="text-muted">Shipping: {formatPrice(order.shippingFee)}</p>
        <p className="text-lg font-bold text-foreground">
          Total: {formatPrice(order.total)}
        </p>
      </div>
    </div>
  );
}
