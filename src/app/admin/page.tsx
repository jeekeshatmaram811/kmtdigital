"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:border-accent hover:text-accent"
        >
          Logout
        </button>
      </div>
      <p className="mt-4 text-muted">
        You&apos;re signed in. Product, order, and settings management are
        coming online as the rest of the admin panel is built out.
      </p>
    </div>
  );
}
