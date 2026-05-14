"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { BookDetailItem } from "@/lib/books";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
};

type BookDetailViewProps = {
  book: BookDetailItem;
  isAdmin: boolean;
};

export function BookDetailView({ book, isAdmin }: BookDetailViewProps) {
  return (
    <main className="pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href="/books"
            className="inline-flex w-fit items-center gap-2 text-[#4a9d6f] transition-colors hover:text-[#5ab87f]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Books</span>
          </Link>

          {isAdmin && (
            <Link
              href={`/books/${book.slug}/edit`}
              className="inline-flex w-fit items-center gap-2 rounded-md border border-[#3a3a3a] px-4 py-2 text-sm font-semibold text-[#f5f1e8] transition-colors hover:border-[#4a9d6f] hover:text-[#4a9d6f]"
            >
              <Pencil className="h-4 w-4" />
              Edit Book
            </Link>
          )}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex justify-center" variants={imageVariants}>
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg bg-[#262727] shadow-2xl">
              <Image
                src={book.imageUrl || "/placeholder.svg"}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 384px, 100vw"
                priority
              />
            </div>
          </motion.div>

          <motion.div className="space-y-8" variants={contentVariants}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold leading-tight text-[#f5f1e8] md:text-5xl">
                {book.title}
              </h1>
            </motion.div>

            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-[#4a9d6f] to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="whitespace-pre-line text-lg leading-relaxed text-[#d4d4d4]">
                {book.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href={book.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#4a9d6f] px-6 py-4 text-base font-bold text-[#1a1a1a] shadow-lg transition-colors hover:bg-[#5ab87f]"
              >
                Buy this book
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
