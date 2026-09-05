"use client";

import { useRouter } from "next/navigation";

export default function ProductRowActions({
  product,
}: {
  product: { id: string; isActive: boolean };
}) {
  const router = useRouter();

  async function toggleActive() {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={toggleActive}
      className={
        product.isActive
          ? "rounded-full bg-success/15 px-2 py-1 text-xs font-medium text-success"
          : "rounded-full bg-muted/15 px-2 py-1 text-xs font-medium text-muted"
      }
    >
      {product.isActive ? "Active" : "Inactive"}
    </button>
  );
}
