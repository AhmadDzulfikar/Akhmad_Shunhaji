import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogDetailView } from "@/components/blog-detail-view";
import { getBlogPostDetail } from "@/lib/posts";

type BlogDetailPageParams = {
  slug: string;
};

type BlogDetailPageProps = {
  params: Promise<BlogDetailPageParams> | BlogDetailPageParams;
};

async function resolveParams(params: BlogDetailPageProps["params"]) {
  return typeof (params as Promise<BlogDetailPageParams>).then === "function"
    ? await params
    : params;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await resolveParams(params);
  const post = await getBlogPostDetail(slug);

  if (!post) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: `${post.title} | Akhmad Shunhaji`,
    openGraph: {
      images: post.imageUrl ? [post.imageUrl] : undefined,
      title: post.title,
      type: "article",
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await resolveParams(params);
  const post = await getBlogPostDetail(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailView post={post} />;
}
