"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { formatPrice, discountPercent } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/StarRating";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-accent/50 hover:shadow-lg hover:shadow-black/20"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-2">
        {discount > 0 && (
          <span className="absolute left-2 top-2 z-10 rounded bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
            {discount}% OFF
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition group-hover:scale-105"
          unoptimized
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="absolute bottom-2 right-2 z-10 translate-y-2 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground opacity-0 shadow transition group-hover:translate-y-0 group-hover:opacity-100 hover:bg-accent-hover"
        >
          + Add
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs uppercase tracking-wide text-muted">
          {product.category}
        </span>
        <h3 className="font-medium text-foreground">{product.name}</h3>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <p className="font-semibold text-foreground">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-muted line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
