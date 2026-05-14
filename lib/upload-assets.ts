import path from "path";
import { promises as fs } from "fs";

import { getManagedUploadPath } from "./image-policy.ts";
import { prisma } from "./prisma.ts";
import type { ImageType } from "./upload.ts";

type RecordUploadAssetInput = {
  height: number;
  kind: ImageType;
  sizeBytes: number;
  url: string;
  width: number;
};

export async function recordUploadAsset(input: RecordUploadAssetInput) {
  const assetPath = getManagedUploadPath(input.url);

  if (!assetPath) {
    return null;
  }

  return prisma.uploadAsset.upsert({
    where: { url: input.url },
    create: {
      height: input.height,
      kind: input.kind,
      path: assetPath,
      sizeBytes: input.sizeBytes,
      url: input.url,
      width: input.width,
    },
    update: {
      height: input.height,
      kind: input.kind,
      path: assetPath,
      sizeBytes: input.sizeBytes,
      width: input.width,
    },
  });
}

export async function markReferencedUploadAssets(urls: Array<string | null | undefined>) {
  const managedUrls = [...new Set(urls.filter((url): url is string => !!url && !!getManagedUploadPath(url)))];

  if (managedUrls.length === 0) {
    return;
  }

  await prisma.uploadAsset.updateMany({
    where: {
      url: {
        in: managedUrls,
      },
    },
    data: {
      lastReferencedAt: new Date(),
    },
  });
}

export function getUploadAssetAbsolutePath(assetPath: string) {
  const uploadRoot = path.resolve(process.cwd(), "public", "uploads");
  const absolutePath = path.resolve(uploadRoot, assetPath);

  if (absolutePath !== uploadRoot && !absolutePath.startsWith(`${uploadRoot}${path.sep}`)) {
    return null;
  }

  return absolutePath;
}

export async function deleteUploadAssetFile(assetPath: string) {
  const absolutePath = getUploadAssetAbsolutePath(assetPath);

  if (!absolutePath) {
    return false;
  }

  try {
    await fs.unlink(absolutePath);
    return true;
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return true;
    }

    throw error;
  }
}
