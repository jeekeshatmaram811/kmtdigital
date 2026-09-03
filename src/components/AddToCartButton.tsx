"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        className="rounded-md bg-black px-6 py-3 font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black"
      >
        {added ? "Added ✓" : "Add to Cart"}
      </button>
      <button
        onClick={() => {
          addItem(product);
          router.push("/cart");
        }}
        className="rounded-md border border-black/20 px-6 py-3 font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        Buy Now
      </button>
    </div>
  );
}
