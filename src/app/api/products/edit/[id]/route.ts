import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const body : {status : boolean} = await request.json();
    await prisma.products.update({
        where: {id: Number((await params).id)},
        data:{  
            status : body.status
        }
    });
    return NextResponse.json({
        status: "success",
        message: "update successfully",
    }, {
      status: 500
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
