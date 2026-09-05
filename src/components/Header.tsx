"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type Category = { name: string; slug: string };

export default function Header({
  siteName,
  logoUrl,
  categories,
}: {
  siteName: string;
  logoUrl?: string | null;
  categories: Category[];
}) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteName}
              width={32}
              height={32}
              className="rounded"
              unoptimized
            />
          ) : null}
          <span className="text-lg font-bold tracking-tight text-foreground">
            {siteName}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-foreground">
          <Link href="/" className="transition hover:text-accent">
            Shop
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="hidden transition hover:text-accent sm:inline"
            >
              {category.name}
            </Link>
          ))}
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
