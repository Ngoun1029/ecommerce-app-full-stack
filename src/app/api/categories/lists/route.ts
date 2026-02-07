import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 10);
    const offset = Number(searchParams.get("offset") ?? 0);

    const [category, total] = await Promise.all([
      prisma.categories.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.categories.count(),
    ]);

    const hasNextPage = offset + limit < total;

    const categoryCustomResponse = category.map((category) => {
      return {
        id: category.id,
        name: category.name,
      };
    });
    return NextResponse.json({
      status: "success",
      items: category,
      total,
      limit,
      offset,
      hasNextPage,
    }, {status : 200});
  } catch (error: unknown) {
    console.log(error);
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
