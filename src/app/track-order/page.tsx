"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

const inputClass =
  "rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

type OrderResult = {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: { productName: string; quantity: number; lineTotal: number }[];
};

export default function TrackOrderPage() {
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/orders/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: form.get("orderNumber"),
        contact: form.get("contact"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("We couldn't find an order matching those details.");
      return;
    }

    setOrder(await res.json());
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Track Order</h1>
      <p className="mb-6 text-muted">
        Enter your order number and the email or phone number you used at checkout.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required name="orderNumber" placeholder="Order number" className={inputClass} />
        <input required name="contact" placeholder="Email or phone" className={inputClass} />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Searching…" : "Track Order"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-8 rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {order.orderNumber}
            </h2>
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              {order.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>

          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-foreground">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold text-foreground">
              {formatPrice(order.total)}
            </span>
          </div>

          <div className="mt-4 border-t border-border pt-4 text-sm text-muted">
            <p className="font-medium text-foreground">Shipping to</p>
            <p>{order.shippingAddress}</p>
            <p>
              {order.shippingCity}, {order.shippingState} {order.shippingPincode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
