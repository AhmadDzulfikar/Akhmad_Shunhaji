"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CoverImageInput from "@/components/CoverImageInput";
import type { BookDetailItem } from "@/lib/books";

type BookFormProps = {
  initialBook?: BookDetailItem;
  mode: "create" | "edit";
};

function getValidationMessage(data: any) {
  if (data?.error !== "validation") {
    return data?.error || "Request failed";
  }

  const fieldErrors = data?.issues?.fieldErrors || {};
  return (
    fieldErrors.title?.[0] ||
    fieldErrors.description?.[0] ||
    fieldErrors.imageUrl?.[0] ||
    fieldErrors.buyUrl?.[0] ||
    "Validasi gagal"
  );
}

export function BookForm({ initialBook, mode }: BookFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialBook?.title ?? "");
  const [description, setDescription] = useState(
    initialBook?.description ?? "",
  );
  const [imageUrl, setImageUrl] = useState(initialBook?.imageUrl ?? "");
  const [buyUrl, setBuyUrl] = useState(initialBook?.buyUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === "edit";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !imageUrl.trim() || !buyUrl.trim()) {
      setError("Title, description, image, dan buy link wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const endpoint = isEdit
        ? `/api/admin/books/${encodeURIComponent(initialBook?.slug || "")}`
        : "/api/admin/books";

      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          buyUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(getValidationMessage(data));
      }

      router.push(`/books/${data.book.slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan buku");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initialBook?.slug) {
      return;
    }

    const ok = confirm(`Yakin hapus buku "${initialBook.title}"?`);
    if (!ok) {
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/books/${encodeURIComponent(initialBook.slug)}`,
        {
          method: "DELETE",
          cache: "no-store",
        },
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Gagal menghapus buku");
      }

      router.push("/books");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Gagal menghapus buku");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#1a1a1a] px-6 py-10 text-[#f5f1e8]">
      <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={initialBook ? `/books/${initialBook.slug}` : "/books"}
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4a9d6f] transition-colors hover:text-[#5ab87f]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-3xl font-bold">
              {isEdit ? "Edit Book" : "Add Book"}
            </h1>
          </div>

          {isEdit && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex w-fit items-center gap-2 rounded-md bg-red-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {error && <p className="rounded-md bg-red-500/10 p-3 text-red-300">{error}</p>}

        <div>
          <label className="mb-2 block text-sm font-medium text-[#b8b8b8]">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full rounded-md border border-[#3a3a3a] bg-[#262727] p-3 text-[#f5f1e8] outline-none transition-colors focus:border-[#4a9d6f]"
            placeholder="Enter book title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#b8b8b8]">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            className="min-h-72 w-full rounded-md border border-[#3a3a3a] bg-[#262727] p-3 text-[#f5f1e8] outline-none transition-colors focus:border-[#4a9d6f]"
            placeholder="Enter book description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <CoverImageInput value={imageUrl} onChange={setImageUrl} />

        <div>
          <label className="mb-2 block text-sm font-medium text-[#b8b8b8]">
            Buy Link <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            className="w-full rounded-md border border-[#3a3a3a] bg-[#262727] p-3 text-[#f5f1e8] outline-none transition-colors focus:border-[#4a9d6f]"
            placeholder="https://example.com/buy-book"
            value={buyUrl}
            onChange={(event) => setBuyUrl(event.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-[#4a9d6f] px-6 py-3 font-bold text-[#1a1a1a] transition-colors hover:bg-[#5ab87f] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : isEdit ? "Save Book" : "Create Book"}
        </button>
      </form>
    </main>
  );
}
