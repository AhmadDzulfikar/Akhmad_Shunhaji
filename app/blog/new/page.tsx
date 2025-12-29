"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("<p></p>");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!title || !contentHtml || contentHtml === "<p></p>") {
      setErr("Title dan isi wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          title,
          content: contentHtml,
          imageUrl: imageUrl || "",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // show precise error
        if (data?.error === "duplicate_slug") {
          throw new Error("Slug sudah dipakai. Ganti slug judulnya.");
        }
        if (data?.error === "validation") {
          const firstIssue =
            data.issues?.fieldErrors?.title?.[0] ||
            data.issues?.fieldErrors?.slug?.[0] ||
            data.issues?.fieldErrors?.content?.[0] ||
            "Validasi gagal";
          throw new Error(firstIssue);
        }
        if (data?.error) throw new Error(data.error);
        throw new Error(`create_failed (${res.status})`);
      }

      // slug dibuat server → pakai yang dikembalikan
      router.push(`/blog/${data.post.slug}`);
    } catch (e: any) {
      setErr(e?.message || "Gagal membuat post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] p-8">
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Add Blog</h1>
        {err && <p className="text-red-400">{err}</p>}

        {/* Title */}
        <input
          className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a]"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a]"
          placeholder="Image URL (opsional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {/* Content (WYSIWYG) */}
        <div className="pt-2">
          <RichTextEditor value={contentHtml} onChange={setContentHtml} />
        </div>

        <button
          disabled={submitting}
          className="px-6 py-3 rounded bg-[#4a9d6f] text-[#1a1a1a] font-bold disabled:opacity-50"
        >
          {submitting ? "Publishing…" : "Publish"}
        </button>
      </form>
    </div>
  );
}
