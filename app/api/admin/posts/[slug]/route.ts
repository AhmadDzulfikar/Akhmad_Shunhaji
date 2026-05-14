import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { BLOG_ARCHIVE_CACHE_TAG } from "@/lib/posts";
import { createPostExcerpt, sanitizePostContent } from "@/lib/post-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readSlug(context: any): Promise<string> {
  // Next 15/16 kadang params berupa Promise, kadang object biasa
  const p = context?.params;
  const val = p && typeof p.then === "function" ? await p : p;
  const slug = val?.slug;
  return typeof slug === "string" ? slug : "";
}

const updateSchema = z.object({
  title: z.string().min(1, "Title wajib diisi"),
  content: z.string().min(1, "Content wajib diisi"),
  // Accept: empty string, full URL, or relative path starting with /
  imageUrl: z.string().refine(
    (val) => val === "" || val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
    { message: "Invalid image URL" }
  ).optional().or(z.literal("")),
});

function revalidateBlogArchive() {
  revalidateTag(BLOG_ARCHIVE_CACHE_TAG, "max");
  revalidatePath("/blog");
}

export async function GET(_req: Request, context: any) {
  try {
    const ok = await requireAdminSession();
    if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const slug = await readSlug(context);
    if (!slug) return NextResponse.json({ error: "invalid_slug" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (e: any) {
    console.error("GET_POST_ERROR:", e);
    return NextResponse.json({ error: "failed_to_get_post" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    const ok = await requireAdminSession();
    if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const slug = await readSlug(context);
    if (!slug) return NextResponse.json({ error: "invalid_slug" }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, imageUrl } = parsed.data;
    const content = sanitizePostContent(parsed.data.content);
    const excerpt = createPostExcerpt(content);

    const updated = await prisma.post.update({
      where: { slug },
      data: {
        title,
        excerpt,
        content,
        imageUrl: imageUrl ? imageUrl : null,
      },
    });

    revalidateBlogArchive();
    return NextResponse.json({ ok: true, post: updated });
  } catch (e: any) {
    // Prisma update akan throw kalau slug tidak ada
    if (String(e?.code) === "P2025") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    console.error("UPDATE_POST_ERROR:", e);
    return NextResponse.json({ error: "failed_to_update_post" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: any) {
  try {
    const ok = await requireAdminSession();
    if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const slug = await readSlug(context);
    if (!slug) return NextResponse.json({ error: "invalid_slug" }, { status: 400 });

    await prisma.post.delete({ where: { slug } });
    revalidateBlogArchive();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // Prisma delete akan throw kalau slug tidak ada
    if (String(e?.code) === "P2025") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    console.error("DELETE_POST_ERROR:", e);
    return NextResponse.json({ error: "failed_to_delete_post" }, { status: 500 });
  }
}
