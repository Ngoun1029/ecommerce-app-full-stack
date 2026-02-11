import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    
    const { searchParams } = new URL(request.url);
    const limit = Math.max(Number(searchParams.get("limit") ?? 5));
    const offset = Math.max(Number(searchParams.get("offset") ?? 0));
    const [products, total] = await Promise.all([
      prisma.products.findMany({
        skip: offset,
        take: limit,
      }),
      prisma.products.count(),
    ]);

    const hasNextPage = offset + limit < total;

    const formattedProduct = products.map((product) => {
      const images = (product.image as Record<string, string>) || {};
      const firstImage = Object.values(images)[0] || null;
      const mainImage = firstImage ? firstImage : null;
      return {
        id: product.id,
        name: product.name,
        image: mainImage,
      };
    });

    return NextResponse.json({
      status: "success",
      items: formattedProduct,
      total,
      limit,
      offset,
      hasNextPage,
    });

    return NextResponse.json(
      {
        status: "success",
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
