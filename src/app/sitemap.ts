import type { MetadataRoute } from "next";
import { getPrisma } from "@/lib/db";

const STATIC_PAGES = [
  "",
  "about",
  "contact",
  "faq",
  "privacy-policy",
  "terms-and-conditions",
  "shipping-returns",
  "track-order",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const prisma = getPrisma();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
  ]);

  return [
    ...STATIC_PAGES.map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified: new Date(),
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ];
}
