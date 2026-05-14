import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { saveImage, isValidImageMime, MAX_FILE_SIZE, ImageType, ImageValidationError } from "@/lib/upload";
import { recordUploadAsset } from "@/lib/upload-assets";
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
const FETCH_TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;

class RemoteImageError extends Error {
  constructor(
    message: string,
    public readonly status = 400
  ) {
    super(message);
    this.name = "RemoteImageError";
  }
}

function isPrivateIP(ip: string): boolean {
  const normalizedIp = ip.toLowerCase().startsWith("::ffff:") ? ip.slice(7) : ip;

  return PRIVATE_RANGES.some((regex) => regex.test(normalizedIp));
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

async function validateRemoteImageUrl(url: string) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new RemoteImageError("invalid url format", 400);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new RemoteImageError("only http/https allowed", 400);
  }

  const isAllowed = await resolveAndValidateHost(parsedUrl.hostname);
  if (!isAllowed) {
    throw new RemoteImageError("blocked host", 400);
  }

  return parsedUrl;
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

async function fetchImageWithRedirects(url: string) {
  let currentUrl = url;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const parsedUrl = await validateRemoteImageUrl(currentUrl);

    const response = await fetchWithTimeout(
      parsedUrl.toString(),
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ImageBot/1.0)",
          Accept: "image/*",
        },
        redirect: "manual",
      },
      FETCH_TIMEOUT_MS
    );

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");

      if (!location) {
        throw new RemoteImageError("redirect missing location", 400);
      }

      if (redirectCount === MAX_REDIRECTS) {
        throw new RemoteImageError("too many redirects", 400);
      }

      currentUrl = new URL(location, parsedUrl).toString();
      continue;
    }

    return response;
  }

  throw new RemoteImageError("too many redirects", 400);
}

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

    // Parse body
    const body = await req.json().catch(() => ({}));
    const url = body.url as string;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // Fetch with timeout and manual redirect validation
    let response: Response;
    try {
      response = await fetchImageWithRedirects(url);
    } catch (error: any) {
      if (error.name === "AbortError") {
        return NextResponse.json({ error: "request timeout" }, { status: 408 });
      }

      if (error instanceof RemoteImageError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
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
    await recordUploadAsset({ ...result, kind: type });

    return NextResponse.json({
      ok: true,
      url: result.url,
      width: result.width,
      height: result.height,
      sizeBytes: result.sizeBytes,
    });
  } catch (error: any) {
    console.error("Upload URL error:", error);

    if (error instanceof RemoteImageError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

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
