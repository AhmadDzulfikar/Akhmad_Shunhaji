import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanHtml(input: string) {
  return sanitizeHtml(input, {
    allowedTags: ["p", "br", "strong", "em", "u", "ul", "ol", "li", "h1", "h2", "h3", "h4", "blockquote", "a", "span"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      "*": ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
        "font-size": [/^\d+(\.\d+)?(px|em|rem|%)$/],
        "font-family": [/^[\w\s"',-]+$/],
      },
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}

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
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET(_req: Request, context: any) {
  try {
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
    const content = cleanHtml(parsed.data.content);

    const updated = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        imageUrl: imageUrl ? imageUrl : null,
      },
    });

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
    const slug = await readSlug(context);
    if (!slug) return NextResponse.json({ error: "invalid_slug" }, { status: 400 });

    await prisma.post.delete({ where: { slug } });
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