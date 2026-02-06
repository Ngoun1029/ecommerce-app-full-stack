import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) ?? 1);
    const perPage = Math.min(Number(searchParams.get("perPage")) ?? 10);

    const skip = (page - 1) * perPage;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      prisma.products.count(),
    ]);

    const productsWithMainImage = products.map((product) => {
      const images = (product.image as Record<string, string>) || {};

      // pick the first image in the object as "mainImage"
      const firstImage = Object.values(images)[0] || null;
      const mainImage = firstImage
        ? `${process.env.R2_PUBLIC_URL}/${firstImage}`
        : null;

      return {
        ...product,
        image: mainImage, // ✅ new single image field
      };
    });

    return NextResponse.json(
      {
        status: "success",
        data: productsWithMainImage,
        meta: {
          current_page: page,
          per_page: perPage,
          total,
          last_page: Math.ceil(total / perPage),
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: "error",
        messsage: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
