import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const BLOG_ARCHIVE_PAGE_SIZE = 9;
export const BLOG_ARCHIVE_REVALIDATE_SECONDS = 300;
export const BLOG_ARCHIVE_CACHE_TAG = "blog-archive";

const blogArchivePostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  imageUrl: true,
  createdAt: true,
} satisfies Prisma.PostSelect;

type BlogArchivePostRecord = Prisma.PostGetPayload<{
  select: typeof blogArchivePostSelect;
}>;

export type BlogArchivePostItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  createdAt: string;
};

export type BlogArchivePageData = {
  items: BlogArchivePostItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function getBlogPageHref(page: number) {
  return `/blog?page=${page}`;
}

export function parsePageParam(value: string | null | undefined) {
  if (value == null || value.trim() === "") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!/^\d+$/.test(trimmedValue)) {
    return null;
  }

  const page = Number.parseInt(trimmedValue, 10);

  if (!Number.isFinite(page) || page < 1) {
    return null;
  }

  return page;
}

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages);
}

function mapArchivePost(record: BlogArchivePostRecord): BlogArchivePostItem {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt?.trim() ?? "",
    imageUrl: record.imageUrl,
    createdAt: record.createdAt.toISOString(),
  };
}

const getBlogArchiveTotalCount = unstable_cache(
  async () => prisma.post.count(),
  ["blog-archive-total-count"],
  {
    revalidate: BLOG_ARCHIVE_REVALIDATE_SECONDS,
    tags: [BLOG_ARCHIVE_CACHE_TAG],
  }
);

async function getBlogArchivePostsForPage(page: number) {
  return unstable_cache(
    async () => {
      const skip = (page - 1) * BLOG_ARCHIVE_PAGE_SIZE;
      const posts = await prisma.post.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip,
        take: BLOG_ARCHIVE_PAGE_SIZE,
        select: blogArchivePostSelect,
      });

      return posts.map((post) => mapArchivePost(post));
    },
    ["blog-archive-page", String(page)],
    {
      revalidate: BLOG_ARCHIVE_REVALIDATE_SECONDS,
      tags: [BLOG_ARCHIVE_CACHE_TAG, `${BLOG_ARCHIVE_CACHE_TAG}:page:${page}`],
    }
  )();
}

export async function getBlogArchivePageData(requestedPage: number): Promise<BlogArchivePageData> {
  const total = await getBlogArchiveTotalCount();
  const totalPages = Math.max(1, Math.ceil(total / BLOG_ARCHIVE_PAGE_SIZE));
  const page = clampPage(requestedPage, totalPages);
  const items = total === 0 ? [] : await getBlogArchivePostsForPage(page);

  return {
    items,
    page,
    pageSize: BLOG_ARCHIVE_PAGE_SIZE,
    total,
    totalPages,
  };
}
