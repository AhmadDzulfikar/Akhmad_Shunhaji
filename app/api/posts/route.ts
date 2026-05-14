import { NextResponse } from "next/server";
import { getBlogArchivePageData, parsePageParam } from "@/lib/posts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedPage = parsePageParam(searchParams.get("page")) ?? 1;
    const archive = await getBlogArchivePageData(requestedPage);

    return NextResponse.json({
      items: archive.items,
      total: archive.total,
      page: archive.page,
      pageCount: archive.totalPages,
      pageSize: archive.pageSize,
    });
  } catch (e: any) {
    console.error("list_posts_error", e);
    return NextResponse.json(
      { error: "failed_to_list_posts", detail: e?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
