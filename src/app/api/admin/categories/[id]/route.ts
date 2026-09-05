import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { slugify } from "@/lib/slugify";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    displayOrder?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const category = await getPrisma().category.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: slugify(body.slug) }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
      },
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await getPrisma().category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "This category still has products assigned to it. Move or delete those products first.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
}
