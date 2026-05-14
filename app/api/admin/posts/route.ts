import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import slugify from "@/lib/slugify"
import { requireAdminSession } from "@/lib/admin-auth"
import { extractImageUrlsFromHtml, isAllowedStoredImageUrl } from "@/lib/image-policy"
import { BLOG_ARCHIVE_CACHE_TAG, BLOG_DETAIL_CACHE_TAG } from "@/lib/posts"
import { createPostExcerpt, sanitizePostContent } from "@/lib/post-content"
import { markReferencedUploadAssets } from "@/lib/upload-assets"

export const dynamic = "force-dynamic"

function revalidateBlogArchive() {
    revalidateTag(BLOG_ARCHIVE_CACHE_TAG, "max")
    revalidateTag(BLOG_DETAIL_CACHE_TAG, "max")
    revalidatePath("/blog")
}

const storedImageUrlSchema = z.string().trim().refine(
    (value) => isAllowedStoredImageUrl(value),
    { message: "Image must be uploaded through the image uploader" }
)

const createSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    imageUrl: storedImageUrlSchema.optional().or(z.literal("")),
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
    await markReferencedUploadAssets([post.imageUrl, ...extractImageUrlsFromHtml(content)])
    revalidateBlogArchive()
    revalidatePath(`/blog/${post.slug}`)
    return NextResponse.json({ ok: true, post })
}
