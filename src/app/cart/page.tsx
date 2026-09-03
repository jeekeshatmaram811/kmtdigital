"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link
          href="/"
          className="mt-4 inline-block rounded-md bg-black px-6 py-3 font-medium text-white dark:bg-white dark:text-black"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 border-b border-black/10 pb-4 dark:border-white/10"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <Link href={`/products/${product.id}`} className="font-medium hover:underline">
                {product.name}
              </Link>
              <p className="text-sm text-neutral-500">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="h-8 w-8 rounded border border-black/20 dark:border-white/20"
              >
                -
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="h-8 w-8 rounded border border-black/20 dark:border-white/20"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-semibold">
              ${(product.price * quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(product.id)}
              className="text-sm text-neutral-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="rounded-md border border-black/20 px-6 py-3 font-medium dark:border-white/20"
          >
            Clear Cart
          </button>
          <Link
            href="/checkout"
            className="rounded-md bg-black px-6 py-3 font-medium text-white dark:bg-white dark:text-black"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
