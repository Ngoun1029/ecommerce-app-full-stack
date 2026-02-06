import { NextRequest, NextResponse } from "next/server";
import { multipleUploadFile } from "../../../../utils/file";
import { r2 } from "../../../../lib/R2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const frmData = await request.formData();
    const files = frmData.getAll("images") as File[];
    if (!files.length) {
      return NextResponse.json(
        { status: "error", message: "No files uploaded" },
        { status: 400 },
      );
    }

    const uploadedFiles = await multipleUploadFile({
      files,
      fileStore: "products",
      productId: 123, // replace with actual productId
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
    // 5️⃣ Return JSON
    return NextResponse.json({
      status: "success",
      data: uploadedFiles,
      message: "Files uploaded successfully",
    });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({
        
    });
  }
}
