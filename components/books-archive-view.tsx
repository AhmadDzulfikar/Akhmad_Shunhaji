"use client";

import { motion } from "framer-motion";
import { BookOpen, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { BookArchiveItem } from "@/lib/books";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const bookCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
};

type BooksArchiveViewProps = {
  books: BookArchiveItem[];
  isAdmin: boolean;
};

export function BooksArchiveView({ books, isAdmin }: BooksArchiveViewProps) {
  return (
    <main className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#f5f1e8] uppercase tracking-wide">
              Books
            </h1>
            <motion.div
              className="h-1 bg-gradient-to-r from-[#4a9d6f] to-transparent mt-4 w-32"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>

          {isAdmin && (
            <Link
              href="/books/new"
              className="inline-flex w-fit items-center gap-2 rounded-md bg-[#4a9d6f] px-4 py-3 text-sm font-bold uppercase tracking-wide text-[#1a1a1a] transition-colors hover:bg-[#5ab87f]"
            >
              <Plus className="h-4 w-4" />
              Add Book
            </Link>
          )}
        </motion.div>

        {books.length === 0 ? (
          <div className="rounded-lg border border-[#3a3a3a] bg-[#222323] p-8 text-center">
            <p className="text-lg font-semibold text-[#f5f1e8]">
              Belum ada buku.
            </p>
            {isAdmin && (
              <Link
                href="/books/new"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#4a9d6f] px-4 py-3 text-sm font-bold text-[#1a1a1a] transition-colors hover:bg-[#5ab87f]"
              >
                <Plus className="h-4 w-4" />
                Add first book
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {books.map((book) => (
              <motion.article
                key={book.id}
                className="group relative"
                variants={bookCardVariants}
                whileHover={{ y: -10 }}
              >
                <Link
                  href={`/books/${book.slug}`}
                  className="relative block aspect-[3/4] overflow-hidden rounded-lg bg-[#262727] shadow-lg outline-none ring-[#4a9d6f] transition-shadow focus-visible:ring-2"
                  aria-label={`Open ${book.title}`}
                >
                  <Image
                    src={book.imageUrl || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <div className="space-y-3">
                      <h2 className="text-lg font-bold leading-snug text-[#f5f1e8]">
                        {book.title}
                      </h2>
                      <p className="line-clamp-4 text-sm leading-relaxed text-[#d4d4d4]">
                        {book.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a9d6f]">
                        <BookOpen className="h-4 w-4" />
                        Book Details
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <Link
                    href={`/books/${book.slug}`}
                    className="text-sm font-semibold leading-snug text-[#d4d4d4] transition-colors hover:text-[#4a9d6f]"
                  >
                    {book.title}
                  </Link>

                  {isAdmin && (
                    <Link
                      href={`/books/${book.slug}/edit`}
                      className="inline-flex shrink-0 items-center justify-center rounded-md border border-[#3a3a3a] p-2 text-[#d4d4d4] transition-colors hover:border-[#4a9d6f] hover:text-[#4a9d6f]"
                      aria-label={`Edit ${book.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
