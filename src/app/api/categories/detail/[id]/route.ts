import { CategoryResponse } from "@/app/types/response/CategoryResponse";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { findOneWithRelations } from "../../../../../../lib/find";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    // Fetch and transform category in **one step**
    const data: CategoryResponse = await (async () => {
      const cat = await findOneWithRelations(
        "categories",
        Number((await params).id),
        "id",
        {},
        true,
      );
      return {
        id: cat.id,
        name: cat.name,
        image: process.env.R2_PUBLIC_URL + "/" + cat.image,
        status: cat.status,
        createdAt: cat.createdAt,
      };
    })();

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
        status: "success",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
