"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const books = [
  {
    id: 1,
    title: "Aku, Kamu, DIA",
    author: "Akhmad Shunhaji",
    description: "Ajakan pelan-pelan untuk berhenti sebentar dari ramainya hari, lalu bertanya dengan jujur: sebenarnya, hidupku sedang ke mana?",
    image: "/aku_kamu_dan_dia.webp",
    url: "/books/aku-kamu-dan-dia",
  },
  {
    id: 2,
    title: "Manajemen Cinta dalam Pendidikan",
    author: "Akhmad Shunhaji",
    description: "Napas baru untuk ruang kelas—mengingatkan bahwa pendidikan yang hebat selalu punya unsur yang sering hilang: rasa manusia.",
    image: "/manajemen_cinta_dalam_pendidikan.webp",
    url: "/books/manajemen-cinta-dalam-pendidikan",
  },
  {
    id: 3,
    title: "Manajemen Cinta sebagai Hidden Curriculum di Madrasah",
    author: "Akhmad Shunhaji",
    description: "Membuka tirai yang selama ini diam-diam menentukan 'warna' sebuah madrasah.",
    image: "/manajemen_cinta_sebagai_hidden.webp",
    url: "/books/manajemen-cinta-sebagai-hidden-curriculum",
  },
  {
    id: 4,
    title: "Konsep Dasar Manajemen Cinta dalam Pendidikan",
    author: "Akhmad Shunhaji",
    description: "Pegangan ringkas yang merapikan cinta jadi konsep yang bisa dipahami cepat.",
    image: "/konsep_dasar_manajemen_cinta.webp",
    url: "/books/konsep-dasar-manajemen-cinta",
  },
]

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

export function BooksSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <motion.section
      className="bg-[#1a1a1a] py-20 px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-[#f5f1e8] mb-16 uppercase tracking-wide"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Books
        </motion.h2>

        {/* Books Grid */}
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
              {/* Book Cover */}
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />

                {/* Hover Overlay */}
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
                      <p className="text-[#d4d4d4] text-sm leading-relaxed">{book.description}</p>
                      <p className="text-[#4a9d6f] text-xs font-semibold">{book.author}</p>
                      <div className="flex flex-col gap-2 pt-2">
                        <a
                          href={book.url}
                          className="text-[#4a9d6f] text-sm underline hover:text-[#5ab87f] transition-colors"
                        >
                          Book Details
                        </a>
                        <a
                          href={book.url}
                          className="text-[#4a9d6f] text-sm underline hover:text-[#5ab87f] transition-colors"
                        >
                          Buy
                        </a>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Book Title */}
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

        {/* Explore More Button */}
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
