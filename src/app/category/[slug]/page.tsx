import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPrisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

async function getCategory(slug: string) {
  return getPrisma().category.findFirst({
    where: { slug, isActive: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? `Shop ${category.name} at KMT Digital.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await getPrisma().product.findMany({
    where: { categoryId: category.id, isActive: true },
    include: { images: { orderBy: { position: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-muted">{category.description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="py-16 text-center text-muted">
          No products in this category yet.
        </p>
      )}
    </div>
  );
}
