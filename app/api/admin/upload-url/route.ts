import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveImage, isValidImageMime, MAX_FILE_SIZE, ImageType } from "@/lib/upload";
import { lookup } from "dns/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SSRF protection: private IP ranges
const PRIVATE_RANGES = [
  /^127\./,                          // 127.0.0.0/8 (localhost)
  /^10\./,                           // 10.0.0.0/8
  /^172\.(1[6-9]|2\d|3[01])\./,     // 172.16.0.0/12
  /^192\.168\./,                     // 192.168.0.0/16
  /^169\.254\./,                     // 169.254.0.0/16 (link-local)
  /^0\./,                            // 0.0.0.0/8
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // 100.64.0.0/10 (CGNAT)
  /^::1$/,                           // IPv6 localhost
  /^fe80:/i,                         // IPv6 link-local
  /^fc00:/i,                         // IPv6 unique local
  /^fd/i,                            // IPv6 unique local
];

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"];

function isPrivateIP(ip: string): boolean {
  return PRIVATE_RANGES.some((regex) => regex.test(ip));
}

async function resolveAndValidateHost(hostname: string): Promise<boolean> {
  // Check blocked hosts first
  if (BLOCKED_HOSTS.includes(hostname.toLowerCase())) {
    return false;
  }

  try {
    // Resolve DNS to get IP
    const addresses = await lookup(hostname, { all: true });
    
    // Check if any resolved IP is private
    for (const addr of addresses) {
      if (isPrivateIP(addr.address)) {
        return false;
      }
    }
    
    return true;
  } catch {
    // DNS resolution failed - block
    return false;
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

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

    // Parse body
    const body = await req.json().catch(() => ({}));
    const url = body.url as string;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "invalid url format" }, { status: 400 });
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "only http/https allowed" }, { status: 400 });
    }

    // SSRF protection: validate host
    const isAllowed = await resolveAndValidateHost(parsedUrl.hostname);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "blocked host", reason: "private or internal address" },
        { status: 400 }
      );
    }

    // Fetch with timeout (8 seconds)
    let response: Response;
    try {
      response = await fetchWithTimeout(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; ImageBot/1.0)",
            Accept: "image/*",
          },
        },
        8000
      );
    } catch (error: any) {
      if (error.name === "AbortError") {
        return NextResponse.json({ error: "request timeout" }, { status: 408 });
      }
      throw error;
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "failed to fetch image", status: response.status },
        { status: 400 }
      );
    }

    // Check content type
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "not an image", contentType },
        { status: 400 }
      );
    }

    // Validate content type is allowed
    const mimeType = contentType.split(";")[0].trim();
    if (!isValidImageMime(mimeType)) {
      return NextResponse.json(
        { error: "unsupported image type", allowed: ["image/jpeg", "image/png", "image/webp"] },
        { status: 400 }
      );
    }

    // Check content length header
    const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "image too large", maxSize: "5MB" },
        { status: 400 }
      );
    }

    // Read response body with size limit
    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: "failed to read response" }, { status: 500 });
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalSize += value.length;
      if (totalSize > MAX_FILE_SIZE) {
        reader.cancel();
        return NextResponse.json(
          { error: "image too large during download", maxSize: "5MB" },
          { status: 400 }
        );
      }

      chunks.push(value);
    }

    // Combine chunks into buffer
    const buffer = Buffer.concat(chunks);

    // Process and save image
    const result = await saveImage(buffer, type);

    return NextResponse.json({
      ok: true,
      url: result.url,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
    });
  } catch (error: any) {
    console.error("Upload URL error:", error);
    return NextResponse.json(
      { error: "upload failed", details: error?.message },
      { status: 500 }
    );
  }
}
