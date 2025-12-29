"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
};

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<Post>({
    title: "",
    slug: "",
    content: "",
    imageUrl: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/admin/posts/${params.slug}`, { cache: "no-store" });

        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          content: data.content ?? "",
          imageUrl: data.imageUrl ?? "",
        });
      } catch (e: any) {
        setErr(e?.message || "Gagal load post");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.slug, router]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/posts/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,       // kalau kamu mau slug nggak bisa diubah, nanti kita hapus field ini
          content: form.content,
          imageUrl: form.imageUrl || "",
        }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.error === "duplicate_slug") throw new Error("Slug sudah dipakai.");
        if (data?.error === "validation") throw new Error("Validasi gagal.");
        throw new Error(data?.error || `Update gagal (${res.status})`);
      }

      const newSlug = data?.post?.slug || form.slug;
      router.push(`/blog/${newSlug}`);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Gagal update");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm("Yakin hapus post ini?")) return;

    setDeleting(true);
    setErr(null);

    try {
      const res = await fetch(`/api/admin/posts/${params.slug}`, { method: "DELETE" });

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Delete gagal (${res.status})`);

      router.push("/blog");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Gagal delete");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#1a1a1a] text-[#b8b8b8] p-8">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Edit Blog</h1>
        {err && <p className="text-red-400">{err}</p>}

        <form onSubmit={onSave} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a]"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a]"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />

          <textarea
            className="w-full p-3 h-56 rounded bg-[#262727] border border-[#3a3a3a]"
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <input
            className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a]"
            placeholder="Image URL (opsional)"
            value={form.imageUrl ?? ""}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <div className="flex gap-3">
            <button
              disabled={saving}
              className="px-6 py-3 rounded bg-[#4a9d6f] text-[#1a1a1a] font-bold disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="px-6 py-3 rounded bg-red-600 text-white font-bold disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}