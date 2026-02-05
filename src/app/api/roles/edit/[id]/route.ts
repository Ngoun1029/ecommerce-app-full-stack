import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { RoleRequest } from "@/app/types/request/RoleRequest";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const body: RoleRequest = await request.json();
    await prisma.roles.update({
      where: { id: Number((await params).id) },
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
