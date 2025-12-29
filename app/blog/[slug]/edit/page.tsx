"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

type Post = {
  id: number;
  slug: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
};

function normalizeSlug(raw: string | string[] | undefined) {
  if (!raw) return "";
  return Array.isArray(raw) ? raw[0] : raw;
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  const slug = useMemo(() => normalizeSlug((params as any)?.slug), [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");

  // Prefill form
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!slug) {
        setErr("Slug tidak terbaca dari URL");
        setLoading(false);
        return;
      }
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/admin/posts/${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error || `Failed to load (HTTP ${res.status})`);
        }

        const post = data as Post;
        if (!alive) return;

        setTitle(post.title ?? "");
        setContent(post.content ?? "");
        setImageUrl(post.imageUrl ?? "");
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Gagal memuat post");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!slug) return;

    setSaving(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          title,
          content,
          imageUrl: imageUrl || "",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.error === "validation"
            ? "Validasi gagal (cek title/content)"
            : data?.error || `update_failed (${res.status})`;
        throw new Error(msg);
      }

      // kalau slug tidak diubah, balik ke detail
      router.push(`/blog/${encodeURIComponent(slug)}`);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Gagal update");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!slug) return;
    const ok = confirm(`Yakin hapus post "${slug}"?`);
    if (!ok) return;

    setDeleting(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `delete_failed (${res.status})`);

      router.push("/blog");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Gagal delete");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Edit Blog</h1>
        <p className="text-sm text-[#b8b8b8]">Slug: {slug || "-"}</p>

        {err && <p className="text-red-400">{err}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a]"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-3 h-48 rounded bg-[#262727] border border-[#3a3a3a]"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a]"
            placeholder="Image URL (opsional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded bg-[#4a9d6f] text-[#1a1a1a] font-bold disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="px-6 py-3 rounded bg-red-500 text-[#1a1a1a] font-bold disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}