import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";

type ImageInput = { url: string; altText?: string };

type ProductInput = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  originalPrice?: number | null;
  sku?: string | null;
  stock?: number;
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  categoryId?: string;
  images?: ImageInput[];
};

export async function POST(request: Request) {
  let body: ProductInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.name || !body.description || !body.categoryId || body.price === undefined) {
    return NextResponse.json(
      { error: "name, description, price, and categoryId are required" },
      { status: 400 }
    );
  }

  if (body.price < 0) {
    return NextResponse.json({ error: "price must be non-negative" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  try {
    const product = await getPrisma().product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice ?? null,
        sku: body.sku ?? null,
        stock: body.stock ?? 0,
        isActive: body.isActive ?? true,
        rating: body.rating ?? 0,
        reviewCount: body.reviewCount ?? 0,
        features: body.features ?? [],
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        categoryId: body.categoryId,
        images: {
          create: (body.images ?? []).map((image, index) => ({
            url: image.url,
            altText: image.altText,
            position: index,
          })),
        },
      },
      include: { images: true, category: true },
    });
    revalidatePath("/", "layout");
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not create product — check the slug/SKU are unique and category exists" },
      { status: 400 }
    );
  }
}
