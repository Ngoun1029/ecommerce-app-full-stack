import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page")) ?? 1);
    const perPage = Math.min(Number(searchParams.get("perPage")) ?? 10);
    const skip = (page - 1) * perPage;
    const [roles, total] = await Promise.all([
      prisma.roles.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
      }),
      prisma.products.count(),
    ]);
    return NextResponse.json(
      {
        status: "success",
        data: roles,
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
      {
        status: 500,
      },
    );
  }
}