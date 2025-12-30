"use client";

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";
import { ImageIcon, Link as LinkIcon, Loader2, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    } as any;
  },
});

const TabIndent = Extension.create({
  name: "tabIndent",
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        const e = this.editor;

        if (e.isActive("bulletList") || e.isActive("orderedList")) {
          return e.commands.sinkListItem("listItem");
        }

        return e.commands.insertContent("\u00A0\u00A0\u00A0\u00A0");
      },
      "Shift-Tab": () => {
        const e = this.editor;
        if (e.isActive("bulletList") || e.isActive("orderedList")) {
          return e.commands.liftListItem("listItem");
        }
        return false;
      },
    };
  },
});

function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

export default function RichTextEditor({ value, onChange }: Props) {
  const fontSizes = useMemo(
    () => [
      { label: "Terkecil", value: "12px" },
      { label: "Kecil", value: "14px" },
      { label: "Normal", value: "16px" },
      { label: "Sedang", value: "20px" },
      { label: "Besar", value: "28px" },
      { label: "Terbesar", value: "32px" },
    ],
    []
  );

  const fontFamilies = useMemo(
    () => [
      { label: "Default", value: "" },
      { label: "Times New Roman", value: "Times New Roman" },
      { label: "Georgia", value: "Georgia" },
      { label: "Arial", value: "Arial" },
      { label: "Inter", value: "Inter" },
    ],
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TabIndent,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
        allowBase64: false,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[320px] w-full rounded-b border border-[#3a3a3a] bg-[#1f1f1f] p-4 text-[#f5f1e8] outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  // Image upload state
  const [imageUploading, setImageUploading] = useState(false);
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Handle inline image file upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor || !file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setImageError("Only JPG, PNG, WEBP allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Max file size is 5MB");
      return;
    }

    setImageError(null);
    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload?type=inline", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Insert image at cursor position
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (e: any) {
      setImageError(e?.message || "Upload failed");
    } finally {
      setImageUploading(false);
    }
  }, [editor]);

  // Handle URL image insert
  const handleImageUrl = useCallback(async () => {
    if (!editor || !imageUrlInput.trim()) return;

    // Validate URL
    try {
      const url = new URL(imageUrlInput.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setImageError("Invalid URL");
      return;
    }

    setImageError(null);
    setImageUploading(true);

    try {
      const res = await fetch("/api/admin/upload-url?type=inline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrlInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch image");
      }

      // Insert image at cursor position
      editor.chain().focus().setImage({ src: data.url }).run();
      setShowImageUrlModal(false);
      setImageUrlInput("");
    } catch (e: any) {
      setImageError(e?.message || "Failed to process URL");
    } finally {
      setImageUploading(false);
    }
  }, [editor, imageUrlInput]);

  const toggleBtnClass = (active: boolean) =>
    cn(
      "h-10 w-10 rounded border border-[#3a3a3a] text-sm font-semibold transition",
      active
        ? "bg-[#FFF3E0] text-[#F57C00]"
        : "bg-[#262727] text-[#f5f1e8] hover:bg-[#2f2f2f]"
    );

  const actionBtnClass =
    "h-10 rounded border border-[#3a3a3a] bg-[#262727] px-3 text-sm font-semibold text-[#f5f1e8] transition hover:bg-[#2f2f2f]";

  const applyBlockPreset = (preset: "h1" | "h2" | "h3" | "h4" | "p") => {
    if (!editor) return;
    const c = editor.chain().focus();

    if (preset === "p") {
      c.setParagraph().unsetBold().unsetFontSize().run();
      return;
    }

    const level =
      preset === "h1"
        ? 1
        : preset === "h2"
          ? 2
          : preset === "h3"
            ? 3
            : 4;
    c.setHeading({ level }).setBold();

    const size =
      preset === "h1"
        ? "32px"
        : preset === "h2"
          ? "28px"
          : preset === "h3"
            ? "20px"
            : "28px";
    c.setFontSize(size).run();
  };

  if (!editor) return null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 rounded-t border border-[#3a3a3a] bg-[#262727] p-3">
        <select
          className="h-10 rounded border border-[#3a3a3a] bg-[#1f1f1f] px-3 text-[#f5f1e8]"
          defaultValue="p"
          onChange={(e) => applyBlockPreset(e.target.value as any)}
        >
          <option value="h1">Judul Utama</option>
          <option value="h2">Judul</option>
          <option value="h3">Subjudul</option>
          <option value="h4">Judul kecil</option>
          <option value="p">Paragraf</option>
        </select>

        <select
          className="h-10 rounded border border-[#3a3a3a] bg-[#1f1f1f] px-3 text-[#f5f1e8]"
          value={editor.getAttributes("textStyle").fontFamily || ""}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) {
              editor.chain().focus().unsetFontFamily().run();
              return;
            }
            editor.chain().focus().setFontFamily(v).run();
          }}
        >
          {fontFamilies.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <select
          className="h-10 rounded border border-[#3a3a3a] bg-[#1f1f1f] px-3 text-[#f5f1e8]"
          value={editor.getAttributes("textStyle").fontSize || "16px"}
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        >
          {fontSizes.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={toggleBtnClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={toggleBtnClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          /
        </button>
        <button
          type="button"
          className={toggleBtnClass(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        <select
          className="h-10 rounded border border-[#3a3a3a] bg-[#1f1f1f] px-3 text-[#f5f1e8]"
          value={
            editor.isActive({ textAlign: "center" })
              ? "center"
              : editor.isActive({ textAlign: "right" })
                ? "right"
                : editor.isActive({ textAlign: "justify" })
                  ? "justify"
                  : "left"
          }
          onChange={(e) =>
            editor.chain().focus().setTextAlign(e.target.value as any).run()
          }
        >
          <option value="left">Rata kiri</option>
          <option value="center">Rata tengah</option>
          <option value="right">Rata kanan</option>
          <option value="justify">Ratakan</option>
        </select>

        <button
          type="button"
          className={actionBtnClass}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Daftar berbutir"
        >
          • List
        </button>
        <button
          type="button"
          className={actionBtnClass}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Daftar bernomor"
        >
          1. List
        </button>

        {/* Image Upload Button */}
        <div className="relative">
          <input
            ref={imageInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className={actionBtnClass}
            onClick={() => imageInputRef.current?.click()}
            disabled={imageUploading}
            title="Upload Image"
          >
            {imageUploading ? (
              <Loader2 className="inline-block w-4 h-4 animate-spin" />
            ) : (
              <>
                <ImageIcon className="inline-block w-4 h-4 mr-1" />
                Image
              </>
            )}
          </button>
        </div>

        {/* Image URL Button */}
        <button
          type="button"
          className={actionBtnClass}
          onClick={() => setShowImageUrlModal(true)}
          disabled={imageUploading}
          title="Insert Image from URL"
        >
          <LinkIcon className="inline-block w-4 h-4 mr-1" />
          URL
        </button>
      </div>

      {/* Image URL Modal */}
      {showImageUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#f5f1e8]">Insert Image from URL</h3>
              <button
                type="button"
                onClick={() => {
                  setShowImageUrlModal(false);
                  setImageUrlInput("");
                  setImageError(null);
                }}
                className="text-[#808080] hover:text-[#f5f1e8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a] text-[#f5f1e8] placeholder-[#808080] focus:border-[#4a9d6f] focus:outline-none mb-3"
              disabled={imageUploading}
            />
            
            {imageError && (
              <p className="text-sm text-red-400 mb-3">{imageError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowImageUrlModal(false);
                  setImageUrlInput("");
                  setImageError(null);
                }}
                className="px-4 py-2 rounded bg-[#262727] text-[#f5f1e8] hover:bg-[#3a3a3a]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImageUrl}
                disabled={imageUploading || !imageUrlInput.trim()}
                className="px-4 py-2 rounded bg-[#4a9d6f] text-[#1a1a1a] font-medium disabled:opacity-50 hover:bg-[#3d8a5f] flex items-center gap-2"
              >
                {imageUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      <EditorContent editor={editor} />

      {/* Image Error Message */}
      {imageError && !showImageUrlModal && (
        <div className="mt-2 text-sm text-red-400">{imageError}</div>
      )}

      <div className="mt-2 text-xs text-[#9a9a9a]">
        Tips: Tab = 4 spasi (atau indent list), Shift+Tab = outdent list.
      </div>
    </div>
  );
}