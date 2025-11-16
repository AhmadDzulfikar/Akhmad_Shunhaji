import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
    const post = await prisma.post.findUnique({ where: { slug: params.slug } })
    if (!post) return NextResponse.json({ error: "not found" }, { status: 404 })
    return NextResponse.json({ post })
}
