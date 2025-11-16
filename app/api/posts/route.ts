import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PAKSA Node.js runtime & non-cached
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  console.log("DATABASE_URL at runtime:", process.env.DATABASE_URL);
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "12", 10)));
    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
      prisma.post.count(),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: pageSize,
        skip,
        // tidak pakai select dulu: biarkan Prisma mengisi semua kolom
      }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (e: any) {
    console.error("list_posts_error", e);
    return NextResponse.json(
      { error: "failed_to_list_posts", detail: e?.message ?? "unknown" },
      { status: 500 }
    );
  }
}