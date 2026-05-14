"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

export function BlogAddButton() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <Link
      href="/blog/new"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4a9d6f] text-[#1a1a1a] font-semibold hover:opacity-90 transition"
    >
      <Plus size={18} />
      Add Blog
    </Link>
  );
}
