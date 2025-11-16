import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  // Kita ubah tipe 'params' menjadi 'any' atau 'Promise<...>' 
  // agar 'await' tidak error di TypeScript
  { params }: { params: any } 
) {
  try {
    // ===================================
    // PERBAIKAN: 'params' adalah Promise
    // Kita harus 'await' untuk mendapatkan nilainya
    // ===================================
    const { slug } = await params;

    // Tambahan: Pastikan slug ada setelah di-await
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Slug tidak valid atau tidak ada" },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { slug: slug }, // Sekarang 'slug' adalah string yang valid
    });

    if (!post) {
      // Kirim 404 jika post tidak ditemukan
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Kirim 'post' secara langsung
    return NextResponse.json(post);

  } catch (e: any) {
    // try...catch untuk menangani semua error
    console.error("GET_POST_BY_SLUG_ERROR:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}