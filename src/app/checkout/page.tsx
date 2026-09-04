"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

const inputClass =
  "rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Nothing to check out</h1>
        <p className="mt-2 text-muted">Your cart is empty.</p>
      </div>
    );
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    setTimeout(() => {
      clearCart();
      router.push("/checkout/success");
    }, 800);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
        Checkout
      </h1>
      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
        <input required placeholder="Full name" className={inputClass} />
        <input required type="email" placeholder="Email" className={inputClass} />
        <input required type="tel" placeholder="Phone number" className={inputClass} />
        <input required placeholder="Shipping address" className={inputClass} />
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="City" className={inputClass} />
          <input required placeholder="State" className={inputClass} />
        </div>
        <input required placeholder="PIN code" className={inputClass} />

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <button
          type="submit"
          disabled={placing}
          className="mt-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-50"
        >
          {placing ? "Placing order…" : "Place Order"}
        </button>
      </form>
    </div>
  );
}
