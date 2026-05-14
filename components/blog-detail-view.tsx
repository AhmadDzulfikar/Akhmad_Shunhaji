"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import Comments from "@/components/Comments";
import type { BlogDetailPostItem } from "@/lib/posts";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type BlogDetailViewProps = {
  post: BlogDetailPostItem;
};

export function BlogDetailView({ post }: BlogDetailViewProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <motion.div
        className="pt-8 px-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#4a9d6f] hover:text-[#f5f1e8] transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>

          {isAdmin && (
            <Link
              href={`/blog/${post.slug}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#4a9d6f] px-4 py-2 font-semibold text-[#1a1a1a] transition-colors duration-300 hover:bg-[#3d8a5f]"
            >
              <Pencil size={16} />
              Edit Blog
            </Link>
          )}
        </div>
      </motion.div>

      {post.imageUrl && (
        <motion.div
          className="max-w-5xl mx-auto px-4 md:px-6 mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <div className="relative h-72 overflow-hidden rounded-xl bg-[#262727] md:h-[420px]">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 960px, calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
        </motion.div>
      )}

      <motion.div
        className="max-w-4xl mx-auto px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-[#f5f1e8] mb-4">
          {post.title}
        </motion.h1>

        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8 pb-8 border-b border-[#3a3a3a]">
          <span className="text-[#808080]">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-[#808080]">-</span>
          <span className="text-[#808080]">By Akhmad Shunhaji</span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="tiptap prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <motion.div variants={itemVariants} className="h-px bg-gradient-to-r from-[#4a9d6f] to-transparent my-12" />

        <Comments slug={post.slug} />
      </motion.div>
    </div>
  );
}
