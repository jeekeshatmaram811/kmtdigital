"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-md border border-border text-foreground transition hover:border-accent"
          >
            -
          </button>
          <span className="w-6 text-center text-foreground">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="h-9 w-9 rounded-md border border-border text-foreground transition hover:border-accent"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button
          onClick={() => {
            addItem(product, quantity);
            router.push("/cart");
          }}
          className="rounded-md border border-border px-6 py-3 font-medium text-foreground transition hover:border-accent hover:text-accent"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
