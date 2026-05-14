import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export const BOOKS_CACHE_TAG = "books";
export const BOOK_DETAIL_CACHE_TAG = "book-detail";
export const BOOKS_REVALIDATE_SECONDS = 300;

const bookArchiveSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  imageUrl: true,
  buyUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BookSelect;

const bookDetailSelect = bookArchiveSelect;

type BookArchiveRecord = Prisma.BookGetPayload<{
  select: typeof bookArchiveSelect;
}>;

type BookDetailRecord = Prisma.BookGetPayload<{
  select: typeof bookDetailSelect;
}>;

export type BookArchiveItem = {
  buyUrl: string;
  createdAt: string;
  description: string;
  excerpt: string;
  id: number;
  imageUrl: string;
  slug: string;
  title: string;
  updatedAt: string;
};

export type BookDetailItem = BookArchiveItem;

export function createBookExcerpt(description: string, maxLength = 150) {
  const normalized = description.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).replace(/\s+\S*$/, "")}...`;
}

function mapBookArchive(record: BookArchiveRecord): BookArchiveItem {
  return {
    buyUrl: record.buyUrl,
    createdAt: record.createdAt.toISOString(),
    description: record.description,
    excerpt: createBookExcerpt(record.description),
    id: record.id,
    imageUrl: record.imageUrl,
    slug: record.slug,
    title: record.title,
    updatedAt: record.updatedAt.toISOString(),
  };
}

function mapBookDetail(record: BookDetailRecord): BookDetailItem {
  return mapBookArchive(record);
}

export async function getBooksArchiveData() {
  return unstable_cache(
    async () => {
      const books = await prisma.book.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: bookArchiveSelect,
      });

      return books.map(mapBookArchive);
    },
    ["books-archive"],
    {
      revalidate: BOOKS_REVALIDATE_SECONDS,
      tags: [BOOKS_CACHE_TAG],
    },
  )();
}

export async function getBookDetail(slug: string) {
  return unstable_cache(
    async () => {
      const book = await prisma.book.findUnique({
        where: { slug },
        select: bookDetailSelect,
      });

      return book ? mapBookDetail(book) : null;
    },
    ["book-detail", slug],
    {
      revalidate: BOOKS_REVALIDATE_SECONDS,
      tags: [BOOK_DETAIL_CACHE_TAG, `${BOOK_DETAIL_CACHE_TAG}:${slug}`],
    },
  )();
}
