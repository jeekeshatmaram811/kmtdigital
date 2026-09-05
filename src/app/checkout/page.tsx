"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

const inputClass =
  "rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Nothing to check out</h1>
        <p className="mt-2 text-muted">Your cart is empty.</p>
      </div>
    );
  }

  async function handlePlaceOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!scriptReady || typeof window.Razorpay === "undefined") {
      setError("Payment gateway is still loading. Please try again in a moment.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");

    setPlacing(true);

    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100),
          currency: "INR",
          receipt: `kmt_${Date.now()}`,
        }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not create order");
      }

      const order = await orderRes.json();

      const razorpay = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "KMT Digital",
        description: "Electronics order payment",
        prefill: { name, email, contact: phone },
        theme: { color: "#f5b400" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              setError("Payment verification failed. Please contact support.");
              setPlacing(false);
              return;
            }

            clearCart();
            router.push("/checkout/success");
          } catch {
            setError("Payment verification failed. Please contact support.");
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
          },
        },
      });

      razorpay.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setPlacing(false);
      });

      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptReady(true)}
      />
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
        Checkout
      </h1>
      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
        <input required name="name" placeholder="Full name" className={inputClass} />
        <input required name="email" type="email" placeholder="Email" className={inputClass} />
        <input required name="phone" type="tel" placeholder="Phone number" className={inputClass} />
        <input required name="address" placeholder="Shipping address" className={inputClass} />
        <div className="grid grid-cols-2 gap-4">
          <input required name="city" placeholder="City" className={inputClass} />
          <input required name="state" placeholder="State" className={inputClass} />
        </div>
        <input required name="pincode" placeholder="PIN code" className={inputClass} />

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {error && (
          <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={placing}
          className="mt-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-50"
        >
          {placing ? "Processing…" : `Pay ${formatPrice(totalPrice)}`}
        </button>
      </form>
    </div>
  );
}
