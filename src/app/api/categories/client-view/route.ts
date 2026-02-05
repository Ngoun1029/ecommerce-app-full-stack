import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { createdAt: "desc" },
    });
    const data = categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: process.env.R2_PUBLIC_URL + "/" + category.image,
      status: category.status,
      createdAt: category.createdAt,
    }));

    return NextResponse.json(
      {
        status: "success",
        data,
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
