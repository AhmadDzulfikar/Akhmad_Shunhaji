import { notFound, redirect } from "next/navigation";

import { BookForm } from "@/components/book-form";
import { requireAdminSession } from "@/lib/admin-auth";
import { getBookDetail } from "@/lib/books";

export const runtime = "nodejs";

type EditBookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { slug } = await params;
  const session = await requireAdminSession();
  if (!session) {
    redirect(`/login?callbackUrl=/books/${encodeURIComponent(slug)}/edit`);
  }

  const book = await getBookDetail(slug);
  if (!book) {
    notFound();
  }

  return <BookForm mode="edit" initialBook={book} />;
}
