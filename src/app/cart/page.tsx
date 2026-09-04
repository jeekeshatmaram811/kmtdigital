"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
        <Link
          href="/"
          className="mt-4 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
        Your Cart
      </h1>
      <div className="flex flex-col gap-4">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex items-center gap-4 border-b border-border pb-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <Link
                href={`/products/${product.id}`}
                className="font-medium text-foreground hover:text-accent"
              >
                {product.name}
              </Link>
              <p className="text-sm text-muted">{formatPrice(product.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="h-8 w-8 rounded border border-border text-foreground transition hover:border-accent"
              >
                -
              </button>
              <span className="w-6 text-center text-foreground">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="h-8 w-8 rounded border border-border text-foreground transition hover:border-accent"
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-semibold text-foreground">
              {formatPrice(product.price * quantity)}
            </p>
            <button
              onClick={() => removeItem(product.id)}
              className="text-sm text-muted hover:text-danger"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <p className="text-xl font-bold text-foreground">
          Total: {formatPrice(totalPrice)}
        </p>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="rounded-md border border-border px-6 py-3 font-medium text-foreground transition hover:border-accent hover:text-accent"
          >
            Clear Cart
          </button>
          <Link
            href="/checkout"
            className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
