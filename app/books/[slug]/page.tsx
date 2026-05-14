import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookDetailView } from "@/components/book-detail-view";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { requireAdminSession } from "@/lib/admin-auth";
import { getBookDetail } from "@/lib/books";

export const runtime = "nodejs";

type BookDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookDetail(slug);

  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  return {
    title: `${book.title} | Books`,
    description: book.excerpt,
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params;
  const [book, adminSession] = await Promise.all([
    getBookDetail(slug),
    requireAdminSession(),
  ]);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      <BookDetailView book={book} isAdmin={Boolean(adminSession)} />
      <Footer />
    </div>
  );
}
