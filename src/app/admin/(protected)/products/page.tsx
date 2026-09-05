import Link from "next/link";
import { getPrisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import ProductRowActions from "@/components/admin/ProductRowActions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; q?: string }>;
}) {
  const { status, category, q } = await searchParams;
  const prisma = getPrisma();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(status === "active" && { isActive: true }),
        ...(status === "inactive" && { isActive: false }),
        ...(category && { categoryId: category }),
        ...(q && { name: { contains: q, mode: "insensitive" } }),
      },
      include: { category: true, images: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
        >
          + New Product
        </Link>
      </div>

      <form className="mb-4 flex flex-wrap gap-2 text-sm">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name…"
          className="rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-2 text-foreground focus:border-accent focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-border px-4 py-2 text-foreground transition hover:border-accent hover:text-accent"
        >
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{product.name}</td>
                <td className="px-4 py-3 text-muted">{product.category.name}</td>
                <td className="px-4 py-3 text-foreground">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-muted">
                  {product.stock === 0 ? (
                    <span className="text-danger">Out of stock</span>
                  ) : (
                    product.stock
                  )}
                </td>
                <td className="px-4 py-3">
                  <ProductRowActions product={product} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm text-accent hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
