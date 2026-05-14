import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { BooksArchiveView } from "@/components/books-archive-view";
import { requireAdminSession } from "@/lib/admin-auth";
import { getBooksArchiveData } from "@/lib/books";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const [books, adminSession] = await Promise.all([
    getBooksArchiveData(),
    requireAdminSession(),
  ]);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      <BooksArchiveView books={books} isAdmin={Boolean(adminSession)} />
      <Footer />
    </div>
  );
}
