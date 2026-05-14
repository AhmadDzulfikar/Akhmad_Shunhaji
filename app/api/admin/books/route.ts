import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-auth";
import { BOOK_DETAIL_CACHE_TAG, BOOKS_CACHE_TAG } from "@/lib/books";
import { createBookPayloadSchema } from "@/lib/book-validation";
import { prisma } from "@/lib/prisma";
import slugify from "@/lib/slugify";
import { markReferencedUploadAssets } from "@/lib/upload-assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function revalidateBooks(slug?: string) {
  revalidateTag(BOOKS_CACHE_TAG, "max");
  revalidateTag(BOOK_DETAIL_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/books");

  if (slug) {
    revalidatePath(`/books/${slug}`);
  }
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const books = await prisma.book.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return NextResponse.json({ items: books });
}

export async function POST(req: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = createBookPayloadSchema().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const slug = await slugify(
      parsed.data.title,
      async (candidate) =>
        Boolean(await prisma.book.findUnique({ where: { slug: candidate } })),
    );

    const book = await prisma.book.create({
      data: {
        slug,
        title: parsed.data.title,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl,
        buyUrl: parsed.data.buyUrl,
      },
    });

    await markReferencedUploadAssets([book.imageUrl]);
    revalidateBooks(book.slug);

    return NextResponse.json({ ok: true, book });
  } catch (error: any) {
    console.error("CREATE_BOOK_ERROR:", error);
    return NextResponse.json(
      { error: "failed_to_create_book" },
      { status: 500 },
    );
  }
}
