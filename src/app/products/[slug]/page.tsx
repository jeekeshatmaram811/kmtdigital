import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPrisma } from "@/lib/db";
import { formatPrice, discountPercent } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import StarRating from "@/components/StarRating";
import ProductGallery from "@/components/ProductGallery";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getPrisma().product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

async function getProduct(slug: string) {
  return getPrisma().product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" } }, category: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? product.description,
    openGraph: product.images[0] ? { images: [product.images[0].url] } : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const discount = discountPercent(product.price, product.originalPrice ?? undefined);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
      <ProductGallery images={product.images} name={product.name} discount={discount} />
      <div className="flex flex-col gap-4">
        <span className="text-xs uppercase tracking-wide text-muted">
          {product.category.name}
        </span>
        <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
        <StarRating rating={product.rating} reviews={product.reviewCount} size="md" />
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
