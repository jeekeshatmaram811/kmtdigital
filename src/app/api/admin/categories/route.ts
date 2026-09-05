import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";

export async function POST(request: Request) {
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

  if (!body.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.name);

  try {
    const category = await getPrisma().category.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        isActive: body.isActive ?? true,
        displayOrder: body.displayOrder ?? 0,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "A category with that slug already exists" },
      { status: 400 }
    );
  }
}
