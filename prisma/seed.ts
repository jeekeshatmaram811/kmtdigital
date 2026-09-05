import { getPrisma } from "../src/lib/db";
import { seedProducts } from "./seedData";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const prisma = getPrisma();

  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      isActive: true,
      displayOrder: 0,
    },
  });

  for (const product of seedProducts) {
    const slug = slugify(product.name);

    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: product.reviews,
        features: product.features,
        categoryId: electronics.id,
        isActive: true,
      },
      create: {
        id: product.id,
        name: product.name,
        slug,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: product.reviews,
        features: product.features,
        stock: 50,
        isActive: true,
        categoryId: electronics.id,
        images: {
          create: [{ url: product.image, position: 0 }],
        },
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "KMT Digital",
      currency: "INR",
    },
  });

  console.log(`Seeded ${seedProducts.length} products under "Electronics".`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    const prisma = getPrisma();
    await prisma.$disconnect();
  });
