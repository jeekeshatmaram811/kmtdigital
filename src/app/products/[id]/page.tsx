import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById, products } from "@/lib/products";
import { formatPrice, discountPercent } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import StarRating from "@/components/StarRating";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-2">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
            {discount}% OFF
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-xs uppercase tracking-wide text-muted">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
        <StarRating rating={product.rating} reviews={product.reviews} size="md" />
        <div className="flex items-baseline gap-3">
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-lg text-muted line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
          {discount > 0 && (
            <span className="text-sm font-semibold text-success">
              Save {discount}%
            </span>
          )}
        </div>
        <p className="text-muted">{product.description}</p>

        <ul className="flex flex-col gap-2 text-sm text-foreground">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-2">
          <AddToCartButton product={product} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <span aria-hidden>🚚</span>
            Free shipping over ₹999
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden>🛡️</span>
            1-year warranty
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden>↩️</span>
            7-day easy returns
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden>🔒</span>
            Secure payments
          </div>
        </div>
      </div>
    </div>
  );
}
