"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { getPaginationItems } from "@/lib/pagination";
import { getBlogPageHref } from "@/lib/posts";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

type PaginationLinkProps = {
  href?: string;
  label: ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
};

function PaginationLink({ href, label, isActive = false, isDisabled = false }: PaginationLinkProps) {
  const className = `inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 font-semibold transition-colors duration-300 ${
    isActive
      ? "bg-[#4a9d6f] text-[#1a1a1a]"
      : "border border-[#3a3a3a] text-[#f5f1e8] hover:border-[#4a9d6f] hover:text-[#4a9d6f]"
  }`;

  if (isActive) {
    return (
      <span aria-current="page" className={className}>
        {label}
      </span>
    );
  }

  if (isDisabled || !href) {
    return (
      <span aria-disabled="true" className={`${className} cursor-not-allowed opacity-50`}>
        {label}
      </span>
    );
  }

  return (
    <Link href={href} prefetch={false} className={className} aria-current={isActive ? "page" : undefined}>
      {label}
    </Link>
  );
}

export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPaginationItems(currentPage, totalPages);
  const previousHref = currentPage > 1 ? getBlogPageHref(currentPage - 1) : undefined;
  const nextHref = currentPage < totalPages ? getBlogPageHref(currentPage + 1) : undefined;

  return (
    <nav aria-label="Blog pagination" className="flex flex-wrap items-center justify-center gap-2 px-4 pb-20">
      <PaginationLink
        href={previousHref}
        label={<ChevronLeft size={20} />}
        isDisabled={previousHref === undefined}
      />

      {items.map((item) => {
        if (item.type === "ellipsis") {
          return (
            <span
              key={item.key}
              aria-hidden="true"
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-[#808080]"
            >
              ...
            </span>
          );
        }

        return (
          <PaginationLink
            key={item.page}
            href={item.page === currentPage ? undefined : getBlogPageHref(item.page)}
            label={item.page}
            isActive={item.page === currentPage}
          />
        );
      })}

      <PaginationLink href={nextHref} label={<ChevronRight size={20} />} isDisabled={nextHref === undefined} />
    </nav>
  );
}
