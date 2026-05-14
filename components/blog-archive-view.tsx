"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { BlogAddButton } from "@/components/blog-add-button";
import { BlogPagination } from "@/components/blog-pagination";
import { Navbar } from "@/components/navbar";
import type { BlogArchivePostItem } from "@/lib/posts";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type BlogArchiveViewProps = {
  currentPage: number;
  posts: BlogArchivePostItem[];
  totalPages: number;
};

export function BlogArchiveView({ currentPage, posts, totalPages }: BlogArchiveViewProps) {
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <motion.div className="pt-20 pb-6 px-8" initial="hidden" animate="visible" variants={titleVariants}>
        <div className="max-w-7xl mx-auto flex items-end justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-[#f5f1e8] tracking-tight">Shunhaji Blog</h1>
            <motion.div
              className="h-1 w-24 bg-gradient-to-r from-[#4a9d6f] to-[#2d6a4f] mt-6"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.3, duration: 0.6, ease: EASE_OUT }}
            />
          </div>

          <BlogAddButton />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 pb-16">
        {posts.length === 0 ? (
          <div className="text-center text-[#b8b8b8] py-20">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-[#262727] rounded-lg overflow-hidden border border-[#3a3a3a] hover:border-[#4a9d6f] transition-colors duration-300">
                    <div className="relative h-48 overflow-hidden bg-[#1a1a1a]">
                      {post.imageUrl ? (
                        <motion.div
                          className="absolute inset-0"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3, ease: EASE_OUT }}
                        >
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            priority={index < 3}
                            sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, calc(100vw - 64px)"
                            className="object-cover"
                          />
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 bg-[#202121]" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#f5f1e8] mb-3 line-clamp-2 group-hover:text-[#4a9d6f] transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#b8b8b8] line-clamp-3 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-[#808080]">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-[#4a9d6f] text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1">
                          Read -&gt;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BlogPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
