// app/api/admin/posts/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const userEmail = (session?.user?.email || "").trim().toLowerCase();

  if (!session || !userEmail || !adminEmail || userEmail !== adminEmail) {
    return null;
  }
  return session;
}

const updateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).max(120).optional(), // boleh optional
  content: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable().optional(),
});

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await context.params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug: currentSlug } = await context.params;
  const body = await req.json().catch(() => null);

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, content, imageUrl } = parsed.data;
  const nextSlug = parsed.data.slug?.trim() || currentSlug;

  try {
    const updated = await prisma.post.update({
      where: { slug: currentSlug },
      data: {
        title,
        slug: nextSlug,
        content,
        imageUrl: imageUrl ? imageUrl : null,
      },
    });

    return NextResponse.json({ ok: true, post: updated });
  } catch (e: any) {
    // Prisma unique constraint error (slug duplikat)
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "duplicate_slug" }, { status: 409 });
    }
    return NextResponse.json(
      { error: "failed_to_update_post", detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await context.params;

  try {
    await prisma.post.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "failed_to_delete_post", detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}