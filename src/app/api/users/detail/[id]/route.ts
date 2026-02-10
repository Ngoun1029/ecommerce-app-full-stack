import { NextRequest, NextResponse } from "next/server";
import { findOneWithRelations } from "../../../../../../lib/find";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const users = await findOneWithRelations(
      "users",
      Number((await params).id),
      "id",
      {
        role: true,
      },
      true,
    );

    return NextResponse.json(
      {
        status: "success",
        data: {
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role.name,
          image: users.image,
        },
      },
      {
        status: 200,
      },
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
