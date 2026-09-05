"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreProduct } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const image = product.images[0]?.url ?? "https://placehold.co/600x600?text=No+Image";
  const outOfStock = product.stock === 0;

  function cartProduct() {
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image,
    };
  }

  function handleAdd() {
    addItem(cartProduct(), quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (outOfStock) {
    return (
      <div className="rounded-md border border-border px-6 py-3 text-center font-medium text-muted">
        Out of Stock
      </div>
    );
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
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
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
            addItem(cartProduct(), quantity);
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
