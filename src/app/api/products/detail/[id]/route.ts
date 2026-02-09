import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { findOneWithRelations } from "../../../../../../lib/find";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // fetch a single product with category relation
    const product = await findOneWithRelations(
      "products",
      Number(id),
      "id",
      {
        category: true, // include category
      },
    );

    if (!product) {
      return NextResponse.json(
        { status: "error", message: "Product not found" },
        { status: 404 },
      );
    }

    // Map images to full URLs

    const productWithUrls = {
      ...product,

      category : product.category.name, 
    };

    return NextResponse.json(
      {
        status: "success",
        data: productWithUrls,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
