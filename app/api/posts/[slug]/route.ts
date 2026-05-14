import { NextResponse } from "next/server";
import { getBlogPostDetail } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const post = await getBlogPostDetail(slug);

    if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json(
      { error: "failed_to_get_post", detail: e?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
