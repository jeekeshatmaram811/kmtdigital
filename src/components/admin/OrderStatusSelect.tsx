"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PAID", "FAILED", "CANCELLED", "SHIPPED", "DELIVERED"];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(newStatus: string) {
    setUpdating(true);
    setError(null);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setUpdating(false);

    if (!res.ok) {
      setError("Could not update status");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <select
        value={status}
        disabled={updating}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
