import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { r2 } from "../lib/R2";

type UploadFileInput = {
  buffer: Buffer;
  originalName: string;
  mimeType?: string;
};

export async function uploadToR2(
  file: UploadFileInput | null,
  directory: string,
  existingKey?: string,
): Promise<string | null> {
  if (!file) return null;

  const extension = file.originalName.split(".").pop();
  const key = `${directory}/${uuidv4()}.${extension}`;
  try {
    // Upload file
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimeType,
      }),
    );

    // Delete old file if exists
    if (existingKey) {
      await r2.send(
        new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: existingKey,
        }),
      );
    }

    return key;
  } catch (error) {
    console.error("R2 upload error:", error);
    return null;
  }
}
