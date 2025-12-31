import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";
import { randomBytes } from "crypto";

export type ImageType = "cover" | "inline";

interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  sizeBytes: number;
}

// Target sizes in bytes
const TARGET_SIZE = {
  cover: 300 * 1024,   // 300KB
  inline: 250 * 1024,  // 250KB
};

const MAX_SIZE = {
  cover: 450 * 1024,   // 450KB max acceptable
  inline: 350 * 1024,  // 350KB max acceptable
};

const MAX_WIDTH = 1200;

// Quality steps to try (descending)
const QUALITY_STEPS = [82, 78, 74, 70, 66, 62, 58, 54, 50];

/**
 * Convert buffer to WebP with compression
 */
export async function processImage(
  inputBuffer: Buffer,
  type: ImageType = "cover"
): Promise<ProcessedImage> {
  // Get image metadata
  const metadata = await sharp(inputBuffer).metadata();
  const originalWidth = metadata.width || 1200;

  // Calculate resize dimensions (maintain aspect ratio)
  const width = Math.min(originalWidth, MAX_WIDTH);

  // First pass: resize and convert to webp with initial quality
  let sharpInstance = sharp(inputBuffer)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY_STEPS[0] });

  let outputBuffer = await sharpInstance.toBuffer();
  let outputMeta = await sharp(outputBuffer).metadata();

  const targetSize = TARGET_SIZE[type];
  const maxSize = MAX_SIZE[type];

  // If already under target, we're done
  if (outputBuffer.length <= targetSize) {
    return {
      buffer: outputBuffer,
      width: outputMeta.width || width,
      height: outputMeta.height || 0,
      sizeBytes: outputBuffer.length,
    };
  }

  // Try progressively lower quality
  for (let i = 1; i < QUALITY_STEPS.length; i++) {
    const quality = QUALITY_STEPS[i];

    sharpInstance = sharp(inputBuffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality });

    outputBuffer = await sharpInstance.toBuffer();

    if (outputBuffer.length <= targetSize) {
      break;
    }
  }

  // If still too large after min quality, try further resize
  if (outputBuffer.length > maxSize) {
    const scaleFactor = Math.sqrt(maxSize / outputBuffer.length);
    const newWidth = Math.floor(width * scaleFactor);

    sharpInstance = sharp(inputBuffer)
      .resize({ width: newWidth, withoutEnlargement: true })
      .webp({ quality: 50 });

    outputBuffer = await sharpInstance.toBuffer();
  }

  outputMeta = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    width: outputMeta.width || 0,
    height: outputMeta.height || 0,
    sizeBytes: outputBuffer.length,
  };
}

/**
 * Generate upload path: /api/uploads/blog/YYYY/MM/
 * Uses API route to serve files (Next.js standalone doesn't serve new static files)
 */
export function getUploadDir(): { dir: string; urlPath: string } {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  // URL uses API route for serving (works in standalone mode)
  const urlPath = `/api/uploads/blog/${year}/${month}`;
  // Filesystem path stays the same
  const dir = path.join(process.cwd(), "public", "uploads", "blog", year, month);

  return { dir, urlPath };
}

/**
 * Generate unique filename
 */
export function generateFilename(): string {
  const timestamp = Date.now();
  const random = randomBytes(6).toString("hex");
  return `${timestamp}-${random}.webp`;
}

/**
 * Save processed image to disk
 */
export async function saveImage(
  buffer: Buffer,
  type: ImageType = "cover"
): Promise<{ url: string; width: number; height: number; sizeBytes: number }> {
  const processed = await processImage(buffer, type);
  const { dir, urlPath } = getUploadDir();
  const filename = generateFilename();

  // Create directory if not exists
  await fs.mkdir(dir, { recursive: true });

  // Write file
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, processed.buffer);

  return {
    url: `${urlPath}/${filename}`,
    width: processed.width,
    height: processed.height,
    sizeBytes: processed.sizeBytes,
  };
}

/**
 * Validate image mime type
 */
export function isValidImageMime(mime: string): boolean {
  const validMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  return validMimes.includes(mime.toLowerCase());
}

/**
 * Max file size: 5MB
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
