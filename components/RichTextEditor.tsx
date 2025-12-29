"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";

// Custom FontSize extension (pakai inline style)
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
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

type Props = {
  value: string; // HTML
  onChange: (html: string) => void;
};

const FONT_SIZES = [
  { label: "Terkecil", value: "12px" },
  { label: "Kecil", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Sedang", value: "18px" },
  { label: "Besar", value: "22px" },
  { label: "Terbesar", value: "28px" },
];

const FONTS = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Arial", value: "Arial" },
];

const BLOCKS = [
  { label: "Paragraf", type: "paragraph" as const },
  { label: "Judul utama (H1)", type: "h1" as const },
  { label: "Judul (H2)", type: "h2" as const },
  { label: "Subjudul (H3)", type: "h3" as const },
  { label: "Judul kecil (H4)", type: "h4" as const },
];

export default function RichTextEditor({ value, onChange }: Props) {
const editor = useEditor({
  immediatelyRender: false, // ✅ wajib di Next.js App Router biar aman dari hydration mismatch
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    FontFamily,
    FontSize,
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),
  ],
  content: value || "<p></p>",
  editorProps: {
    attributes: {
      class:
        "prose prose-invert max-w-none focus:outline-none min-h-[420px] px-4 py-3",
    },
  },
  onUpdate: ({ editor }) => onChange(editor.getHTML()),
});

  if (!editor) return null;

  const setBlock = (v: string) => {
    if (v === "paragraph") editor.chain().focus().setParagraph().run();
    if (v === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
    if (v === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
    if (v === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
    if (v === "h4") editor.chain().focus().toggleHeading({ level: 4 }).run();
  };

  return (
    <div className="w-full rounded border border-[#3a3a3a] bg-[#262727] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center px-3 py-2 border-b border-[#3a3a3a] bg-[#222]">
        {/* Block */}
        <select
          className="px-2 py-1 rounded bg-[#262727] border border-[#3a3a3a]"
          onChange={(e) => setBlock(e.target.value)}
          defaultValue="paragraph"
        >
          {BLOCKS.map((b) => (
            <option key={b.type} value={b.type}>
              {b.label}
            </option>
          ))}
        </select>

        {/* Font family */}
        <select
          className="px-2 py-1 rounded bg-[#262727] border border-[#3a3a3a]"
          onChange={(e) => {
            const v = e.target.value;
            if (!v) editor.chain().focus().unsetFontFamily().run();
            else editor.chain().focus().setFontFamily(v).run();
          }}
          defaultValue=""
        >
          {FONTS.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Font size */}
        <select
          className="px-2 py-1 rounded bg-[#262727] border border-[#3a3a3a]"
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          defaultValue="16px"
        >
          {FONT_SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-[#3a3a3a] mx-1" />

        {/* Inline style */}
        <button
          type="button"
          className="px-2 py-1 rounded border border-[#3a3a3a]"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded border border-[#3a3a3a] italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded border border-[#3a3a3a] underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        <div className="w-px h-6 bg-[#3a3a3a] mx-1" />

        {/* Align */}
        <button type="button" className="px-2 py-1 rounded border border-[#3a3a3a]" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          L
        </button>
        <button type="button" className="px-2 py-1 rounded border border-[#3a3a3a]" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          C
        </button>
        <button type="button" className="px-2 py-1 rounded border border-[#3a3a3a]" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          R
        </button>
        <button type="button" className="px-2 py-1 rounded border border-[#3a3a3a]" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          J
        </button>

        <div className="w-px h-6 bg-[#3a3a3a] mx-1" />

        {/* Lists */}
        <button type="button" className="px-2 py-1 rounded border border-[#3a3a3a]" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button type="button" className="px-2 py-1 rounded border border-[#3a3a3a]" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}