import { NextRequest, NextResponse } from "next/server";
import { multipleUploadFile } from "../../../../../utils/file";
import { prisma } from "../../../../../lib/prisma";
import { r2 } from "../../../../../lib/R2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string).trimEnd();
    const productImage = formData.getAll("image[]") as File[];
    const price = formData.get("price") as string;
    const categoryId = formData.get("category_id") as string;
    const description = formData.get("description") as string;
    const colors = formData.getAll("color[]") as string[];
    const status = formData.get("status") as unknown as boolean;

    if (!productImage.length) {
      return NextResponse.json(
        { status: "error", message: "No file provided" },
        { status: 400 },
      );
    }
    const product = await prisma.products.create({
      data: {
        name,
        image: [],
        price: Number(price),
        categoryId: Number(categoryId),
        rate: 0,
        description,
        color: colors.map((c) => c.toString()),
        status : Boolean(status),
      },
    });

    const uploadedFiles = await multipleUploadFile({
      files: productImage,
      fileStore: "products",
      productId: product.id, // replace with actual productId
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
    await prisma.products.update({
      where: { id: product.id },
      data: {
        image: uploadedFiles,
      },
    });

    return NextResponse.json(
      { status: "success", message: "Product created successfully" },
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
