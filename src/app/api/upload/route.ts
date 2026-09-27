import cloudinary from "@/lib/cloudinary";
import { requireRole } from "@/lib/access-control";
import { NextResponse } from "next/server";
import type { UploadApiResponse } from "cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MIME_SIGNATURES: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (bytes) =>
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes) =>
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a,
  "image/webp": (bytes) =>
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP",
};

export async function POST(request: Request) {
  try {
    await requireRole("ADMIN");
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_IMAGE_SIZE + 64 * 1024) {
      return NextResponse.json(
        { message: "Image must be 5 MB or smaller" },
        { status: 413 },
      );
    }
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { message: "Image must be 5 MB or smaller" },
        { status: 413 },
      );
    }
    const signatureCheck = MIME_SIGNATURES[file.type];
    if (!signatureCheck) {
      return NextResponse.json(
        { message: "Only JPEG, PNG, or WebP images are accepted" },
        { status: 415 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!signatureCheck(buffer)) {
      return NextResponse.json(
        { message: "File contents do not match an allowed image type" },
        { status: 415 },
      );
    }

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Cloudinary returned no upload result"));
          },
        );

        uploadStream.end(buffer);
      },
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AccessDeniedError") {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }
    console.error("Cloudinary upload error:", error);

    return NextResponse.json(
      { success: false, message: "Image upload failed" },
      { status: 500 },
    );
  }
}
