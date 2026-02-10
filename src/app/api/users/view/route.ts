import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1));
    const perPage = Math.max(Number(searchParams.get("perPage") ?? 10));
    const [users, total] = await Promise.all([
      prisma.users.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include:{
            role: true,
        }
      }),
      prisma.users.count(),
    ]);

    const userWithImageUrl = users.map((user)=>{
        return {
            ...user,
            role: user.role.name,
        }
    })
    return NextResponse.json(
      {
        status: "success",
        data: userWithImageUrl,
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
