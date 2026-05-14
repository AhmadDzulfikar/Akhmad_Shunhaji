import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { saveImage, isValidImageMime, MAX_FILE_SIZE, ImageType, ImageValidationError } from "@/lib/upload";
import { recordUploadAsset } from "@/lib/upload-assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Check admin auth
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Get type from query params
    const { searchParams } = new URL(req.url);
    const type: ImageType = searchParams.get("type") === "inline" ? "inline" : "cover";

    // Parse multipart form data
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "no file provided" }, { status: 400 });
    }

    // Validate file size before processing
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "file too large", maxSize: "5MB" },
        { status: 400 }
      );
    }

    // Validate mime type
    if (!isValidImageMime(file.type)) {
      return NextResponse.json(
        { error: "invalid file type", allowed: ["image/jpeg", "image/png", "image/webp"] },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = Buffer.from(await file.arrayBuffer());

    // Process and save image (convert to WebP, compress)
    const result = await saveImage(bytes, type);
    await recordUploadAsset({ ...result, kind: type });

    return NextResponse.json({
      ok: true,
      url: result.url,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    if (error instanceof ImageValidationError) {
      return NextResponse.json(
        { error: "invalid image", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "upload failed", details: error?.message },
      { status: 500 }
    );
  }
}
