import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveImage, isValidImageMime, MAX_FILE_SIZE, ImageType } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Check admin auth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
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

    return NextResponse.json({
      ok: true,
      url: result.url,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "upload failed", details: error?.message },
      { status: 500 }
    );
  }
}