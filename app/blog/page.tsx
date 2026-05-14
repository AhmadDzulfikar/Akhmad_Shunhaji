import { redirect } from "next/navigation";

import { BlogArchiveView } from "@/components/blog-archive-view";
import { getBlogPageHref } from "@/lib/blog-routes";
import { getBlogArchivePageData, parsePageParam } from "@/lib/posts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BlogPageSearchParams = {
  page?: string | string[];
};

type BlogPageProps = {
  searchParams?: Promise<BlogPageSearchParams> | BlogPageSearchParams;
};

async function resolveSearchParams(searchParams: BlogPageProps["searchParams"]) {
  if (!searchParams) {
    return {};
  }

  return typeof (searchParams as Promise<BlogPageSearchParams>).then === "function"
    ? await searchParams
    : searchParams;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const rawPage = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;
  const parsedPage = parsePageParam(rawPage);

  if (rawPage !== undefined && parsedPage == null) {
    redirect(getBlogPageHref(1));
  }

  const requestedPage = parsedPage ?? 1;
  const archive = await getBlogArchivePageData(requestedPage);

  if (rawPage !== undefined && requestedPage !== archive.page) {
    redirect(getBlogPageHref(archive.page));
  }

  return (
    <BlogArchiveView
      currentPage={archive.page}
      posts={archive.items}
      totalPages={archive.totalPages}
    />
  );
}
