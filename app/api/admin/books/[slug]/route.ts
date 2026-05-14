import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-auth";
import { BOOK_DETAIL_CACHE_TAG, BOOKS_CACHE_TAG } from "@/lib/books";
import { createBookPayloadSchema } from "@/lib/book-validation";
import { prisma } from "@/lib/prisma";
import { markReferencedUploadAssets } from "@/lib/upload-assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readSlug(context: any): Promise<string> {
  const params = context?.params;
  const value = params && typeof params.then === "function" ? await params : params;
  const slug = value?.slug;

  return typeof slug === "string" ? slug : "";
}

function revalidateBooks(slug?: string) {
  revalidateTag(BOOKS_CACHE_TAG, "max");
  revalidateTag(BOOK_DETAIL_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/books");

  if (slug) {
    revalidatePath(`/books/${slug}`);
  }
}

export async function GET(_req: Request, context: any) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const slug = await readSlug(context);
    if (!slug) {
      return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({ where: { slug } });
    if (!book) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error: any) {
    console.error("GET_BOOK_ERROR:", error);
    return NextResponse.json({ error: "failed_to_get_book" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const slug = await readSlug(context);
    if (!slug) {
      return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
    }

    const existing = await prisma.book.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = createBookPayloadSchema({
      currentImageUrl: existing.imageUrl,
    }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await prisma.book.update({
      where: { slug },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl,
        buyUrl: parsed.data.buyUrl,
      },
    });

    await markReferencedUploadAssets([updated.imageUrl]);
    revalidateBooks(slug);

    return NextResponse.json({ ok: true, book: updated });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    console.error("UPDATE_BOOK_ERROR:", error);
    return NextResponse.json(
      { error: "failed_to_update_book" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, context: any) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const slug = await readSlug(context);
    if (!slug) {
      return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
    }

    await prisma.book.delete({ where: { slug } });
    revalidateBooks(slug);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (String(error?.code) === "P2025") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    console.error("DELETE_BOOK_ERROR:", error);
    return NextResponse.json(
      { error: "failed_to_delete_book" },
      { status: 500 },
    );
  }
}
