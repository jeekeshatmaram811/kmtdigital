import { getPrisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const prisma = getPrisma();

  const [productCount, categoryCount, orderCount, lowStockCount, paidOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
      prisma.order.findMany({
        where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
        select: { total: true },
      }),
    ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Products", value: productCount },
    { label: "Categories", value: categoryCount },
    { label: "Orders", value: orderCount },
    { label: "Low Stock", value: lowStockCount },
    { label: "Revenue", value: formatPrice(revenue) },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <p className="text-xs uppercase tracking-wide text-muted">
              {stat.label}
            </p>
            <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
