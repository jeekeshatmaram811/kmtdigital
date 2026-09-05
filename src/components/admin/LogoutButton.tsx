"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-md border border-border px-3 py-2 text-left text-sm text-foreground transition hover:border-accent hover:text-accent"
    >
      Logout
    </button>
  );
}
