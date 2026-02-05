
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";
import { uploadToR2 } from "../../../../../utils/file";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse incoming form data
    const formData = await request.formData();

    const name = (formData.get("name") as string)?.trim();
    const imageFile = formData.get("image") as File;
    const status = formData.get("status") === "true" ? true : false;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ status: "error", message: "Name is required" }, { status: 400 });
    }
    if (!imageFile) {
      return NextResponse.json({ status: "error", message: "Image is required" }, { status: 400 });
    }

    const imageUrl = await uploadToR2(
      {
        buffer: Buffer.from(await imageFile.arrayBuffer()),
        originalName: imageFile.name,
        mimeType: imageFile.type,
      },
      "categories"
    );

    if (!imageUrl) {
      return NextResponse.json({ status: "error", message: "Failed to upload image" }, { status: 500 });
    }

    // Save category in the database
    await prisma.categories.create({
      data: {
        name,
        image: imageUrl,
        status: status ?? false,
      },
    });

    // Respond with success
    return NextResponse.json(
      { status: "success", message: "Category created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
