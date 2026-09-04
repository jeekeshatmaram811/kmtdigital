"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-foreground">
            KMT Digital
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-accent sm:inline">
            Electronics
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-foreground">
          <Link href="/" className="transition hover:text-accent">
            Shop
          </Link>
          <Link href="/cart" className="relative transition hover:text-accent">
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
