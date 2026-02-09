import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const frmData = await request.formData();

    const name = (frmData.get("name") as string)?.trim();
    const image = frmData.get("image") as string;
    const description = frmData.get("description") as string;
    const link = frmData.get("link") as string;

    if (!name)
      return NextResponse.json({ status: "error", message: "Required" });
    if (!image)
      return NextResponse.json({ status: "error", message: "Required" });
    if (!description)
      return NextResponse.json({ status: "error", message: "Required" });
    if (!link)
      return NextResponse.json({ status: "error", message: "Required" });

    await prisma.banners.create({
      data: {
        name,
        image,
        description,
        link,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "banner successfully created",
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    return NextResponse.json({
      status: "error",
    });
  }
}
