import path from "path";
import { promises as fs } from "fs";

import { getManagedUploadPath, extractImageUrlsFromHtml } from "../lib/image-policy.ts";
import { prisma } from "../lib/prisma.ts";

function parseMinAgeHours() {
  const rawArg = process.argv.find((arg) => arg.startsWith("--min-age-hours="));
  const rawValue = rawArg?.split("=")[1];
  const parsedValue = rawValue ? Number.parseInt(rawValue, 10) : 24;

  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 24;
}

function getUploadAssetAbsolutePath(assetPath: string) {
  const uploadRoot = path.resolve(process.cwd(), "public", "uploads");
  const absolutePath = path.resolve(uploadRoot, assetPath);

  if (absolutePath !== uploadRoot && !absolutePath.startsWith(`${uploadRoot}${path.sep}`)) {
    return null;
  }

  return absolutePath;
}

async function removeAssetFile(assetPath: string) {
  const absolutePath = getUploadAssetAbsolutePath(assetPath);

  if (!absolutePath) {
    throw new Error(`Unsafe asset path: ${assetPath}`);
  }

  try {
    await fs.unlink(absolutePath);
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

async function main() {
  const shouldDelete = process.argv.includes("--delete");
  const minAgeHours = parseMinAgeHours();
  const cutoffDate = new Date(Date.now() - minAgeHours * 60 * 60 * 1000);

  const posts = await prisma.post.findMany({
    select: {
      content: true,
      imageUrl: true,
    },
  });
  const books = await prisma.book.findMany({
    select: {
      imageUrl: true,
    },
  });

  const referencedUrls = new Set<string>();

  for (const post of posts) {
    const urls = [post.imageUrl, ...extractImageUrlsFromHtml(post.content)];

    for (const url of urls) {
      if (url && getManagedUploadPath(url)) {
        referencedUrls.add(url);
      }
    }
  }

  for (const book of books) {
    if (book.imageUrl && getManagedUploadPath(book.imageUrl)) {
      referencedUrls.add(book.imageUrl);
    }
  }

  const assets = await prisma.uploadAsset.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const unusedAssets = assets.filter(
    (asset) => !referencedUrls.has(asset.url) && asset.createdAt <= cutoffDate
  );

  console.log(
    `${shouldDelete ? "Deleting" : "Dry run:"} ${unusedAssets.length} unused upload asset(s) older than ${minAgeHours} hour(s).`
  );

  for (const asset of unusedAssets) {
    console.log(`${shouldDelete ? "delete" : "would delete"} ${asset.url}`);

    if (!shouldDelete) {
      continue;
    }

    await removeAssetFile(asset.path);
    await prisma.uploadAsset.delete({
      where: {
        id: asset.id,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("Failed to cleanup unused upload assets.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
