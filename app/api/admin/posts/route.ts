import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import slugify from "@/lib/slugify"
import { requireAdminSession } from "@/lib/admin-auth"
import { BLOG_ARCHIVE_CACHE_TAG } from "@/lib/posts"
import { createPostExcerpt, sanitizePostContent } from "@/lib/post-content"

export const dynamic = "force-dynamic"

function revalidateBlogArchive() {
    revalidateTag(BLOG_ARCHIVE_CACHE_TAG, "max")
    revalidatePath("/blog")
}

const createSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    // Accept: empty string, full URL, or relative path starting with /
    imageUrl: z.string().refine(
        (val) => val === "" || val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://"),
        { message: "Invalid image URL" }
    ).optional().or(z.literal("")),
})

export async function GET(req: Request) {
    const ok = await requireAdminSession()
    if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get("page") || "1")
    const take = 12
  const skip = (page - 1) * take
    const [items, total] = await Promise.all([
    prisma.post.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip, take }),
    prisma.post.count(),
    ])
    return NextResponse.json({ items, total, page, pages: Math.ceil(total / take) })
}

export async function POST(req: Request) {
    const ok = await requireAdminSession()
    if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 })
    const { title, imageUrl } = parsed.data
    const content = sanitizePostContent(parsed.data.content)
    const excerpt = createPostExcerpt(content)

    const slug = await slugify(title, async (s) => !!(await prisma.post.findUnique({ where: { slug: s } })))
    const post = await prisma.post.create({
        data: { title, excerpt, content, imageUrl: imageUrl || null, slug },
    })
    revalidateBlogArchive()
    return NextResponse.json({ ok: true, post })
}
