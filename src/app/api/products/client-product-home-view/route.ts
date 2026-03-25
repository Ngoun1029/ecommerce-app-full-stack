import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const [products, total] = await Promise.all([
      prisma.products.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
        },
      }),
      prisma.products.count(),
    ]);

    const productsWithMainImage = products.map((product) => {
      const images = (product.image as Record<string, string>) || {};
      const firstImage = Object.values(images)[0] || null;

      return {
        ...product,
        image: firstImage ? firstImage : null,
        category: product.category.name,
      };
    });

    return NextResponse.json(
      {
        status: "success",
        data: productsWithMainImage,
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
