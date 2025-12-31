import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Allowed extensions for security
const ALLOWED_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png", ".gif"];

/**
 * GET /api/uploads/[...path]
 * Serve uploaded files from public/uploads directory
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: "path required" }, { status: 400 });
    }

    // Join path segments
    const filePath = pathSegments.join("/");
    
    // Security: check extension
    const ext = path.extname(filePath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: "invalid file type" }, { status: 400 });
    }

    // Security: prevent path traversal
    if (filePath.includes("..") || filePath.includes("\\")) {
      return NextResponse.json({ error: "invalid path" }, { status: 400 });
    }

    // Build absolute path
    const absolutePath = path.join(process.cwd(), "public", "uploads", filePath);
    
    // Check if file exists
    try {
      await fs.access(absolutePath);
    } catch {
      return NextResponse.json({ error: "file not found" }, { status: 404 });
    }

    // Read file
    const fileBuffer = await fs.readFile(absolutePath);

    // Determine content type
    const contentType = getContentType(ext);

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Serve upload error:", error);
    return NextResponse.json(
      { error: "failed to serve file" },
      { status: 500 }
    );
  }
}

function getContentType(ext: string): string {
  const types: Record<string, string> = {
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
  };
  return types[ext] || "application/octet-stream";
}
