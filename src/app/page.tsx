import ProductCard from "@/components/ProductCard";
import { getPrisma } from "@/lib/db";

export const revalidate = 60;

const perks = [
  { icon: "🚚", label: "Free shipping over ₹999" },
  { icon: "🛡️", label: "1-year warranty" },
  { icon: "🔒", label: "Secure payments" },
  { icon: "↩️", label: "7-day easy returns" },
];

export default async function Home() {
  const products = await getPrisma().product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { position: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-surface to-background">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            Electronics, curated
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Power your everyday with gear that keeps up.
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Headphones, smartwatches, sunglasses, and more — handpicked electronics,
            priced fair, shipped fast, all across India.
          </p>
          <a
            href="#shop"
            className="mt-8 inline-block rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition hover:bg-accent-hover"
          >
            Shop Now
          </a>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-6 text-sm text-muted sm:grid-cols-4">
          {perks.map((perk) => (
            <div key={perk.label} className="flex items-center gap-2">
              <span aria-hidden>{perk.icon}</span>
              <span>{perk.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div id="shop" className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            All Electronics
          </h2>
          <p className="mt-2 text-muted">{products.length} products, zero fuss.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="py-16 text-center text-muted">
            No products available right now — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
