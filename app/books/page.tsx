"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]


const booksData = [
  {
    id: 1,
    slug: "the-midnight-library",
    title: "The Midnight Library",
    author: "Akhmad Shunhaji",
    shortDescription: "A novel about choices and second chances.",
    fullDescription:
      "The Midnight Library is a captivating exploration of life's infinite possibilities. Through the eyes of Nora Seed, readers journey through alternate versions of her life, discovering that every choice matters and that it's never too late to find your path. This profound novel reminds us that the life we're living is just one of many possibilities.",
    image: "/midnight-library-cover.png",
  },
  {
    id: 2,
    slug: "half-of-a-yellow-sun",
    title: "Half of a Yellow Sun",
    author: "Akhmad Shunhaji",
    shortDescription: "A powerful story set during the Nigerian-Biafran War.",
    fullDescription:
      "Half of a Yellow Sun is an epic tale that weaves together the lives of three characters during one of Africa's most devastating conflicts. With lyrical prose and unforgettable characters, this novel captures the complexity of love, identity, and survival during wartime. It's a masterpiece that resonates long after the final page.",
    image: "/book-cover-yellow-sun.jpg",
  },
  {
    id: 3,
    slug: "americanah",
    title: "Americanah",
    author: "Akhmad Shunhaji",
    shortDescription: "An epic tale of love, race, and identity.",
    fullDescription:
      "Americanah follows Ifemelu and Obinze's journey across continents as they navigate love, ambition, and the complexities of race and identity. From Lagos to Princeton to New York, this novel explores what it means to belong in a world that constantly questions where you're from. A stunning exploration of modern love and belonging.",
    image: "/book-cover-americanah.jpg",
  },
  {
    id: 4,
    slug: "purple-hibiscus",
    title: "Purple Hibiscus",
    author: "Akhmad Shunhaji",
    shortDescription: "A coming-of-age story in modern Nigeria.",
    fullDescription:
      "Purple Hibiscus is a tender yet powerful coming-of-age story set in post-colonial Nigeria. Through the eyes of fifteen-year-old Kambili, we witness a family's struggle with faith, tradition, and freedom. This debut novel is a beautiful meditation on the bonds of family and the courage it takes to break free.",
    image: "/book-cover-purple-hibiscus.jpg",
  },
  {
    id: 5,
    slug: "chimamanda-stories",
    title: "Chimamanda Stories",
    author: "Akhmad Shunhaji",
    shortDescription: "A collection of interconnected short stories.",
    fullDescription:
      "This collection brings together stories that explore the human condition through diverse perspectives and settings. Each story is a window into different lives, cultures, and experiences, connected by themes of identity, belonging, and transformation. A masterful exploration of what it means to be human.",
    image: "/book-cover-americanah.jpg",
  },
  {
    id: 6,
    slug: "the-thing-around-your-neck",
    title: "The Thing Around Your Neck",
    author: "Akhmad Shunhaji",
    shortDescription: "Stories of immigration and cultural displacement.",
    fullDescription:
      "The Thing Around Your Neck is a collection of twelve interconnected stories that explore the immigrant experience with wit, warmth, and unflinching honesty. From Lagos to America, these stories capture the complexities of cultural displacement, identity, and the search for home. A powerful and moving collection.",
    image: "/midnight-library-cover.png",
  },
  {
    id: 7,
    slug: "dear-ijeawele",
    title: "Dear Ijeawele",
    author: "Akhmad Shunhaji",
    shortDescription: "A letter on feminism and raising a daughter.",
    fullDescription:
      "In this powerful letter, the author addresses a friend on how to raise a feminist daughter. With wisdom, humor, and clarity, she explores what feminism means and how to instill its values in the next generation. A must-read for anyone interested in gender equality and raising empowered children.",
    image: "/book-cover-yellow-sun.jpg",
  },
  {
    id: 8,
    slug: "notes-on-grief",
    title: "Notes on Grief",
    author: "Akhmad Shunhaji",
    shortDescription: "A meditation on loss and remembrance.",
    fullDescription:
      "Notes on Grief is a poignant meditation on loss, written with the author's characteristic grace and insight. Through personal reflection and universal truths, this work explores how we grieve, remember, and ultimately, how we continue to live. A beautiful and necessary read.",
    image: "/book-cover-americanah.jpg",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
  hover: {
    y: -12,
    transition: {
      duration: 0.3,
    },
  },
}

const overlayVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
}

export default function BooksPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          {/* Page Title */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#f5f1e8] uppercase tracking-wide">Books</h1>
            <motion.div
              className="h-1 bg-gradient-to-r from-[#4a9d6f] to-transparent mt-4 w-32"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>

          {/* Books Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {booksData.map((book) => (
              <motion.div
                key={book.id}
                className="relative group cursor-pointer"
                variants={bookCardVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredId(book.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Book Cover */}
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                  <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />

                  {hoveredId === book.id && (
                    <motion.div
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6"
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
                        <h3 className="text-[#f5f1e8] font-bold text-lg">{book.title}</h3>
                        <p className="text-[#4a9d6f] text-sm font-semibold">{book.author}</p>
                        <p className="text-[#d4d4d4] text-sm leading-relaxed">{book.shortDescription}</p>
                        <Link
                          href={`/books/${book.slug}`}
                          className="inline-block mt-4 px-6 py-2 bg-[#4a9d6f] text-[#1a1a1a] rounded-full font-semibold text-sm hover:bg-[#5ab87f] transition-colors duration-300"
                        >
                          Book Details
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* Book Title */}
                <motion.p
                  className="text-center text-[#d4d4d4] mt-4 font-semibold text-sm line-clamp-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {book.title}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}