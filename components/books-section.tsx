"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { BookArchiveItem } from "@/lib/books"

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
}

const bookVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
  hover: {
    y: -10,
    transition: {
      duration: 0.3,
    },
  },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
}

type BooksSectionProps = {
  books: BookArchiveItem[]
}

export function BooksSection({ books }: BooksSectionProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  if (books.length === 0) {
    return null
  }

  return (
    <motion.section
      className="bg-[#1a1a1a] py-20 px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-[#f5f1e8] mb-16 uppercase tracking-wide"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Books
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {books.map((book) => (
            <motion.div
              key={book.id}
              className="relative group cursor-pointer"
              variants={bookVariants}
              whileHover="hover"
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link
                href={`/books/${book.slug}`}
                className="relative block aspect-[3/4] rounded-lg overflow-hidden bg-gray-800"
              >
                <Image
                  src={book.imageUrl || "/placeholder.svg"}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                />

                {hoveredId === book.id && (
                  <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      className="text-center space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="text-[#d4d4d4] text-sm leading-relaxed">{book.excerpt}</p>
                      <p className="text-[#4a9d6f] text-sm underline">Book Details</p>
                    </motion.div>
                  </motion.div>
                )}
              </Link>

              <motion.p
                className="text-center text-[#d4d4d4] mt-4 font-semibold text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {book.title}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/books">
            <motion.button
              className="px-8 py-3 border-2 border-[#4a9d6f] text-[#4a9d6f] rounded-full font-semibold uppercase tracking-wide hover:bg-[#4a9d6f] hover:text-[#1a1a1a] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore More
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
