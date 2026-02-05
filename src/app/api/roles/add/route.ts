import { RoleRequest } from "@/app/types/request/RoleRequest";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

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