import { redirect } from "next/navigation";

import { BookForm } from "@/components/book-form";
import { requireAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export default async function NewBookPage() {
  const session = await requireAdminSession();
  if (!session) {
    redirect("/login?callbackUrl=/books/new");
  }

  return <BookForm mode="create" />;
}
