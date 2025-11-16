"use client"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function NewPostPage() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function uploadImage(): Promise<string | undefined> {
        if (!file) return undefined
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
        if (!res.ok) throw new Error("upload failed")
        const json = await res.json()
        return json.url as string
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
        const imageUrl = await uploadImage()
        const res = await fetch("/api/admin/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, imageUrl }),
        })
        if (!res.ok) throw new Error("create failed")
        router.push("/blog")
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] py-16 px-8">
        <div className="max-w-3xl mx-auto bg-[#262727] p-6 rounded-lg border border-[#3a3a3a]">
            <h1 className="text-[#f5f1e8] text-2xl font-bold mb-6">Add Blog Post</h1>
            <form onSubmit={onSubmit} className="space-y-4">
            <input className="w-full p-3 rounded bg-[#1a1a1a] text-[#f5f1e8]" placeholder="Title"
                    value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea className="w-full p-3 rounded bg-[#1a1a1a] text-[#f5f1e8] min-h-[220px]" placeholder="Content"
                        value={content} onChange={e=>setContent(e.target.value)} />
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)}
                    className="text-[#f5f1e8]" />
            <button disabled={loading} className="px-6 py-3 bg-[#4a9d6f] text-[#1a1a1a] rounded font-semibold">
                {loading ? "Saving..." : "Publish"}
            </button>
            </form>
        </div>
        </div>
    )
}
