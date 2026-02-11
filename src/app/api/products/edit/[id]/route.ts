import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { ProductUpdateRequest } from "@/app/types/request/ProductRequest";
import { multipleUploadFile } from "../../../../../../utils/file";
import { r2 } from "../../../../../../lib/R2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const body: ProductUpdateRequest = await request.json();

    const product = await prisma.products.findFirst({
      where: {
        id: Number((await params).id),
      },
    });

    if (!product) {
      return NextResponse.json(
        { status: "error", message: "Not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.products.update({
      where: { id: product.id },
      data: {
        name: body.name,
        price: body.price,
        categoryId: body.categoryId,
        description: body.description,
        color: Array.isArray(body.color) ? body.color : [],
        status: body.status,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Update successfully",
      },
      { status: 200 },
    );
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const formData = await request.formData();

    const files = formData.getAll("image") as File[];
    const removeKeys = formData.getAll("current_image") as string[];

    // 1️⃣ Fetch product
    const product = await prisma.products.findUnique({
      where: { id: Number((await params).id) },
      select: { image: true },
    });

    if (!product) {
      return NextResponse.json(
        { status: "error", message: "Product not found" },
        { status: 404 },
      );
    }

    // 2️⃣ Normalize existing images (OBJECT, not array)
    let existingImages: Record<string, string> =
      typeof product.image === "object" && product.image !== null
        ? (product.image as Record<string, string>)
        : {};

    // 3️⃣ Remove selected images by KEY (Laravel-equivalent)
    for (const key of removeKeys) {
      delete existingImages[key];
    }

    if (files.length > 0) {
      const uploadedImages = await multipleUploadFile({
        files,
        fileStore: "products",
        productId: Number((await params).id),
        upload: async ({ buffer, path, type }) => {
          await r2.send(
            new PutObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME!,
              Key: path,
              Body: buffer,
              ContentType: `image/${type}`,
            }),
          );
          return path;
        },
      });

      // Merge old + new (same as array_merge)
      existingImages = {
        ...existingImages,
        ...uploadedImages,
      };
    }

    // 5️⃣ Save JSON object (FULL overwrite)
    await prisma.products.update({
      where: { id: Number((await params).id) },
      data: {
        image: existingImages,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Images updated successfully",
        image: existingImages,
      },
      { status: 200 },
    );
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
