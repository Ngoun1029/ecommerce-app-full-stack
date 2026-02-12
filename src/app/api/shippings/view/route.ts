import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page") ?? 1));
    const perPage = Math.max(Number(searchParams.get("perPage") ?? 10));
    const skip = (page - 1) * perPage;

    const [shipping, total] = await Promise.all([
      prisma.shippings.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.shippings.count(),
    ]);

    const formattedData = shipping.map((shipping) => {
      return {
        id: shipping.id,
        user: shipping.user.name,
        address1: shipping.address1,
        address2: shipping.address2,
        city: shipping.city,
        stats: shipping.stats,
        countryCode: shipping.countryCode,
        postalCode: shipping.postalCode,
        createdAt: shipping.createdAt,
        updatedAt: shipping.updatedAt,
      };
    });

    return NextResponse.json(
      {
        status: "success",
        data: formattedData,
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
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
