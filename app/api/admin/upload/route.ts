import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  // (Protected via middleware)
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "no file" }, { status: 400 })

    const bytes = Buffer.from(await file.arrayBuffer())
    const ext = (file.name.split(".").pop() || "png").toLowerCase()
    const filename = `${randomUUID()}.${ext}`

    const dir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), bytes)

    return NextResponse.json({ url: `/uploads/${filename}` })
}