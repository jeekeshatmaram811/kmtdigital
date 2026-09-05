import { NextResponse } from "next/server";
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: ProductInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.price !== undefined && body.price < 0) {
    return NextResponse.json({ error: "price must be non-negative" }, { status: 400 });
  }

  try {
    const prisma = getPrisma();

    const product = await prisma.$transaction(async (tx) => {
      if (body.images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
      }

      return tx.product.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name }),
          ...(body.slug !== undefined && { slug: slugify(body.slug) }),
          ...(body.description !== undefined && { description: body.description }),
          ...(body.price !== undefined && { price: body.price }),
          ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice }),
          ...(body.sku !== undefined && { sku: body.sku }),
          ...(body.stock !== undefined && { stock: body.stock }),
          ...(body.isActive !== undefined && { isActive: body.isActive }),
          ...(body.rating !== undefined && { rating: body.rating }),
          ...(body.reviewCount !== undefined && { reviewCount: body.reviewCount }),
          ...(body.features !== undefined && { features: body.features }),
          ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle }),
          ...(body.seoDescription !== undefined && { seoDescription: body.seoDescription }),
          ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
          ...(body.images !== undefined && {
            images: {
              create: body.images.map((image, index) => ({
                url: image.url,
                altText: image.altText,
                position: index,
              })),
            },
          }),
        },
        include: { images: true, category: true },
      });
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Could not update product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await getPrisma().product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
