"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-neutral-500">Your cart is empty.</p>
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
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
        <input
          required
          placeholder="Full name"
          className="rounded-md border border-black/20 px-4 py-3 dark:border-white/20 dark:bg-transparent"
        />
        <input
          required
          type="email"
          placeholder="Email"
          className="rounded-md border border-black/20 px-4 py-3 dark:border-white/20 dark:bg-transparent"
        />
        <input
          required
          placeholder="Shipping address"
          className="rounded-md border border-black/20 px-4 py-3 dark:border-white/20 dark:bg-transparent"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            placeholder="City"
            className="rounded-md border border-black/20 px-4 py-3 dark:border-white/20 dark:bg-transparent"
          />
          <input
            required
            placeholder="Postal code"
            className="rounded-md border border-black/20 px-4 py-3 dark:border-white/20 dark:bg-transparent"
          />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={placing}
          className="mt-2 rounded-md bg-black px-6 py-3 font-medium text-white transition hover:opacity-85 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {placing ? "Placing order…" : "Place Order"}
        </button>
      </form>
    </div>
  );
}
