"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
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
      "The Midnight Library is a captivating exploration of life's infinite possibilities. Through the eyes of Nora Seed, readers journey through alternate versions of her life, discovering that every choice matters and that it's never too late to find your path. This profound novel reminds us that the life we're living is just one of many possibilities.\n\nWith lyrical prose and deeply relatable characters, this novel explores themes of regret, hope, and the power of second chances. It's a meditation on the roads not taken and the infinite possibilities that exist within each moment of our lives.",
    image: "/midnight-library-cover.png",
  },
  {
    id: 2,
    slug: "half-of-a-yellow-sun",
    title: "Half of a Yellow Sun",
    author: "Akhmad Shunhaji",
    shortDescription: "A powerful story set during the Nigerian-Biafran War.",
    fullDescription:
      "Half of a Yellow Sun is an epic tale that weaves together the lives of three characters during one of Africa's most devastating conflicts. With lyrical prose and unforgettable characters, this novel captures the complexity of love, identity, and survival during wartime. It's a masterpiece that resonates long after the final page.\n\nThe novel follows Olanna, Ugwu, and Richard as their lives intersect during the Nigerian-Biafran War. Through their interconnected stories, we witness the human cost of war and the enduring power of love and connection.",
    image: "/book-cover-yellow-sun.jpg",
  },
  {
    id: 3,
    slug: "americanah",
    title: "Americanah",
    author: "Akhmad Shunhaji",
    shortDescription: "An epic tale of love, race, and identity.",
    fullDescription:
      "Americanah follows Ifemelu and Obinze's journey across continents as they navigate love, ambition, and the complexities of race and identity. From Lagos to Princeton to New York, this novel explores what it means to belong in a world that constantly questions where you're from. A stunning exploration of modern love and belonging.\n\nThis sweeping novel captures the immigrant experience with humor, insight, and profound emotional depth. It's a love story, a social commentary, and a meditation on identity all rolled into one unforgettable narrative.",
    image: "/book-cover-americanah.jpg",
  },
  {
    id: 4,
    slug: "purple-hibiscus",
    title: "Purple Hibiscus",
    author: "Akhmad Shunhaji",
    shortDescription: "A coming-of-age story in modern Nigeria.",
    fullDescription:
      "Purple Hibiscus is a tender yet powerful coming-of-age story set in post-colonial Nigeria. Through the eyes of fifteen-year-old Kambili, we witness a family's struggle with faith, tradition, and freedom. This debut novel is a beautiful meditation on the bonds of family and the courage it takes to break free.\n\nWith exquisite prose and deeply drawn characters, this novel explores the tension between tradition and modernity, faith and doubt, and the search for identity in a rapidly changing world.",
    image: "/book-cover-purple-hibiscus.jpg",
  },
  {
    id: 5,
    slug: "chimamanda-stories",
    title: "Chimamanda Stories",
    author: "Akhmad Shunhaji",
    shortDescription: "A collection of interconnected short stories.",
    fullDescription:
      "This collection brings together stories that explore the human condition through diverse perspectives and settings. Each story is a window into different lives, cultures, and experiences, connected by themes of identity, belonging, and transformation. A masterful exploration of what it means to be human.\n\nFrom intimate character studies to sweeping social commentary, these stories showcase the author's range and depth as a storyteller.",
    image: "/book-cover-americanah.jpg",
  },
  {
    id: 6,
    slug: "the-thing-around-your-neck",
    title: "The Thing Around Your Neck",
    author: "Akhmad Shunhaji",
    shortDescription: "Stories of immigration and cultural displacement.",
    fullDescription:
      "The Thing Around Your Neck is a collection of twelve interconnected stories that explore the immigrant experience with wit, warmth, and unflinching honesty. From Lagos to America, these stories capture the complexities of cultural displacement, identity, and the search for home. A powerful and moving collection.\n\nEach story is a gem, offering insights into the human experience and the universal themes that connect us across cultures and continents.",
    image: "/midnight-library-cover.png",
  },
  {
    id: 7,
    slug: "dear-ijeawele",
    title: "Dear Ijeawele",
    author: "Akhmad Shunhaji",
    shortDescription: "A letter on feminism and raising a daughter.",
    fullDescription:
      "In this powerful letter, the author addresses a friend on how to raise a feminist daughter. With wisdom, humor, and clarity, she explores what feminism means and how to instill its values in the next generation. A must-read for anyone interested in gender equality and raising empowered children.\n\nThis short but impactful work is a call to action for parents, educators, and anyone who believes in the power of equality and justice.",
    image: "/book-cover-yellow-sun.jpg",
  },
  {
    id: 8,
    slug: "notes-on-grief",
    title: "Notes on Grief",
    author: "Akhmad Shunhaji",
    shortDescription: "A meditation on loss and remembrance.",
    fullDescription:
      "Notes on Grief is a poignant meditation on loss, written with the author's characteristic grace and insight. Through personal reflection and universal truths, this work explores how we grieve, remember, and ultimately, how we continue to live. A beautiful and necessary read.\n\nThis intimate essay collection offers solace and understanding to anyone who has experienced loss, reminding us that grief is a testament to love.",
    image: "/book-cover-americanah.jpg",
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
}

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
}

export default function BookDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const book = booksData.find((b) => b.slug === slug)

  if (!book) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#f5f1e8] mb-4">Book Not Found</h1>
          <Link href="/books" className="text-[#4a9d6f] hover:text-[#5ab87f]">
            Back to Books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <main className="pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <Link
              href="/books"
              className="inline-flex items-center gap-2 text-[#4a9d6f] hover:text-[#5ab87f] transition-colors"
            >
              <span>←</span>
              <span>Back to Books</span>
            </Link>
          </motion.div>

          {/* Book Detail Container */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left: Book Cover */}
            <motion.div className="flex justify-center" variants={imageVariants}>
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" priority />
              </div>
            </motion.div>

            {/* Right: Book Information */}
            <motion.div className="space-y-8" variants={contentVariants}>
              {/* Title */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="text-4xl md:text-5xl font-bold text-[#f5f1e8] mb-2 leading-tight">{book.title}</h1>
                <p className="text-[#4a9d6f] text-lg font-semibold">{book.author}</p>
              </motion.div>

              {/* Divider */}
              <motion.div
                className="h-1 w-16 bg-gradient-to-r from-[#4a9d6f] to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />

              {/* Description */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-[#d4d4d4] text-lg leading-relaxed whitespace-pre-line">{book.fullDescription}</p>
              </motion.div>

              {/* Buy Button */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <a
                  href="https://www.instagram.com/shunhaji_09/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-[#4a9d6f] text-[#1a1a1a] rounded-full font-bold text-lg hover:bg-[#5ab87f] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Buy this book
                </a>
              </motion.div>

              {/* Related Books Suggestion */}
              <motion.div
                className="pt-8 border-t border-[#3a3a3a]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-[#d4d4d4] text-sm mb-4">Interested in more books?</p>
                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 text-[#4a9d6f] hover:text-[#5ab87f] transition-colors font-semibold"
                >
                  <span>Explore all books</span>
                  <span>→</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
