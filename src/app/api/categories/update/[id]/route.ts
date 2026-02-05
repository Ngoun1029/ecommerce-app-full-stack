
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { uploadToR2 } from "../../../../../../utils/file";
import { CategoryRequest } from "@/app/types/request/CategoryRequest";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const body: CategoryRequest = await request.json();
    await prisma.categories.update({
      where: { id: Number((await params).id) },
      data: {
        name: body.name,
        status: body.status,
      },
    });
    return NextResponse.json(
      {
        status: "success",
        message: `Category updated successfully`,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const frmData = await request.formData();
    const imageFile = frmData.get("image") as File;
    const imageUrl = await uploadToR2(
      {
        buffer: Buffer.from(await imageFile.arrayBuffer()),
        originalName: imageFile.name,
        mimeType: imageFile.type,
      },
      "categories",
    );

    if (!imageUrl) {
      return NextResponse.json(
        { status: "error", message: "Failed to upload image" },
        { status: 500 },
      );
    }

    await prisma.categories.update({
      where: { id: Number((await params).id) },
      data: {
        image: imageUrl,
      },
    });
    return NextResponse.json(
      {
        status: "success",
        message: `Category updated successfully`,
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
