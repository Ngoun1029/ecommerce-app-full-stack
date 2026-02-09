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

type UploadInput = File | File[] | null;
type UploadedFilesMap = Record<string, string>;

type UploadFileArgs = {
  files: UploadInput;
  fileStore: string;
  productId: string | number;
  upload: (args: {
    buffer: Buffer;
    path: string;
    type: string;
  }) => Promise<string>;
};

export async function multipleUploadFile({
  files,
  fileStore,
  productId,
  upload,
}: UploadFileArgs): Promise<UploadedFilesMap> {
  if (!files) return {};

  const fileArray = Array.isArray(files) ? files : [files];
  const result: UploadedFilesMap = {};

  for (const file of fileArray) {
    const originalName = file.name;

    // ✅ get real extension
    const extension = (() => {
      const ext = originalName.split(".").pop()?.toLowerCase();
      if (!ext) throw new Error("File has no extension");
      return ext;
    })();

    const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");
    const encryptedName = Buffer.from(nameWithoutExtension).toString("base64");

    const filename = `${encryptedName}.${extension}`;
    const cloudPath = `${fileStore}/${productId}/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const storedPath = await upload({
        buffer,
        path: cloudPath,
        type: extension,
      });

      result[originalName] = `${process.env.R2_PUBLIC_URL}/${storedPath}`;
    } catch {
      // fallback → UUID (Edge-safe)
      const fallbackName = `${uuidv4()}.${extension}`;
      const fallbackPath = `${fileStore}/${productId}/${fallbackName}`;

      const storedPath = await upload({
        buffer,
        path: fallbackPath,
        type: extension,
      });

      result[originalName] = storedPath;
    }
  }

  return result;
}
