import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export type RoleRequest = {
  name: string;
};

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
      prisma.roles.count(),
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RoleRequest = await request.json();
    await prisma.roles.create({
      data: {
        name: body.name.trim(),
      },
    });
    return NextResponse.json(
      {
        status: "success",
        message: "Role created successfully",
      },
      { status: 201 },
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

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body: { id: number; name: string } = await request.json();
    await prisma.roles.update({
      where: { id: body.id },
      data: { name: body.name.trim() },
    });
    return NextResponse.json(
      {
        status: "success",
        message: "Role updated successfully",
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
