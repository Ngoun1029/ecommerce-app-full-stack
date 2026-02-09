import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { uploadToR2 } from "../../../../../utils/file";
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body: { name: string; email: string } = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    await prisma.users.update({
      data: {
        name: body.name,
        email: body.email,
      },
      where: { id: decoded.id },
    });
    return NextResponse.json(
      {
        status: "success",
        message: "Updated Successfully",
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    const frmData = await request.formData();
    const imageFile = frmData.get("image") as File;
    const imageUrl = await uploadToR2(
      {
        buffer: Buffer.from(await imageFile.arrayBuffer()),
        originalName: imageFile.name,
        mimeType: imageFile.type,
      },
      "users",
    );

    if (!imageUrl) {
      return NextResponse.json(
        { status: "error", message: "Failed to upload image" },
        { status: 500 },
      );
    }

    await prisma.users.update({
      where: { id: decoded.id },
      data: {
        image: imageUrl
      },
    });
    return NextResponse.json(
      {
        status: "success",
        message: "Updated Successfully",
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
