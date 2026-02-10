import { NextRequest, NextResponse } from "next/server";
import { findOneWithRelations } from "../../../../../../lib/find";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
): Promise<NextResponse> {
  try {
    const bannerDetails = await findOneWithRelations(
      "banners",
      Number((await params).id),
      "id",
      {},
      true,
    );

    return NextResponse.json(
      { status: "success", data: bannerDetails },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
