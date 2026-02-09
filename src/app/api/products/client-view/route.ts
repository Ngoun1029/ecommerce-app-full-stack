import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const perPage = Math.min(Number(searchParams.get("perPage") ?? 10), 100);
    const skip = (page - 1) * perPage;
    // Filters
    const nameFilter = searchParams.get("name") || undefined;
    const categoryFilter = searchParams.get("categoryId")
      ? Number(searchParams.get("categoryId"))
      : undefined;
    const priceMin = searchParams.get("priceMin")
      ? parseFloat(searchParams.get("priceMin")!)
      : undefined;
    const priceMax = searchParams.get("priceMax")
      ? parseFloat(searchParams.get("priceMax")!)
      : undefined;

    // Build Prisma where object
    const where: any = {
        status: true
    };
    if (nameFilter) {
      where.name = { contains: nameFilter, mode: "insensitive" }; // case-insensitive search
    }
    if (categoryFilter !== undefined) {
      where.categoryId = categoryFilter;
    }
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price.gte = priceMin;
      if (priceMax !== undefined) where.price.lte = priceMax;
    }

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
        },
      }),
      prisma.products.count({ where }),
    ]);

    // Map mainImage
    const productsWithMainImage = products.map((product) => {
    
      const images = (product.image as Record<string, string>) || {};
      const firstImage = Object.values(images)[0] || null;
      const mainImage = firstImage
        ? firstImage
        : null;

      return {
        ...product,
        image: mainImage,
        category: product.category.name,
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
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
