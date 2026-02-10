import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const body: {
      name: string;
      image: string;
      description: string;
      link: string;
    } = await request.json();
    await prisma.banners.update({
        where: {id: Number((await params).id)},
        data:{
            name: body.name,
            image: body.image,
            description: body.description,
            link: body.link,
        }
    });
    return NextResponse.json(
      { status: "success", message: "Updated successfully" },
      { status: 201 },
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
