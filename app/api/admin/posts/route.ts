import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import slugify from "@/lib/slugify"

export const dynamic = "force-dynamic"

const createSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    imageUrl: z.string().url().optional().or(z.literal("")),
})

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || "1")
    const take = 12
  const skip = (page - 1) * take
    const [items, total] = await Promise.all([
    prisma.post.findMany({ orderBy: { createdAt: "desc" }, skip, take }),
    prisma.post.count(),
    ])
    return NextResponse.json({ items, total, page, pages: Math.ceil(total / take) })
}

export async function POST(req: Request) {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 })
    const { title, content, imageUrl } = parsed.data

    const slug = await slugify(title, async (s) => !!(await prisma.post.findUnique({ where: { slug: s } })))
    const post = await prisma.post.create({
        data: { title, content, imageUrl: imageUrl || null, slug },
    })
    return NextResponse.json({ ok: true, post })
}
