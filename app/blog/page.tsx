"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// === Sanity wiring ===
import { groq } from "next-sanity"
import { sanityClient } from "@/lib/sanity.client"
import { urlFor } from "@/lib/image"

type SanityBlock = {
  _type: string
  children?: { _type: string; text?: string }[]
}

type PostDoc = {
  _id: string
  title: string
  slug: { current: string }
  coverImage?: any
  content?: SanityBlock[]
  date: string // coalesce(publishedAt, _createdAt)
}

// Query: list + count (12/halaman, terbaru di atas)
const PAGE_SIZE = 12
const LIST_QUERY = groq`*[_type=="post"]
| order(coalesce(publishedAt, _createdAt) desc)[$start...$end]{
  _id,
  title,
  slug,
  coverImage,
  content,
  "date": coalesce(publishedAt, _createdAt)
}`
const COUNT_QUERY = groq`count(*[_type=="post"])`

// Helper: ambil ringkasan teks dari Portable Text (jika kamu tidak punya field excerpt)
function toExcerpt(blocks?: SanityBlock[], maxLen = 180): string {
  if (!blocks || !Array.isArray(blocks)) return ""
  const text = blocks
    .filter(b => b._type === "block")
    .map(b => (b.children || []).map(c => c.text || "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trim() + "…"
}

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<PostDoc[]>([])

  // Ambil total count sekali di awal
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const total: number = await sanityClient.fetch(COUNT_QUERY)
        if (!active) return
        setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)))
      } catch (e) {
        // Optional: console.error(e)
        setTotalPages(1)
      }
    })()
    return () => { active = false }
  }, [])

  // Ambil halaman saat currentPage berubah
  useEffect(() => {
    let active = true
    setLoading(true)
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    ;(async () => {
      try {
        const docs: PostDoc[] = await sanityClient.fetch(LIST_QUERY, { start, end })
        if (!active) return
        setPosts(docs)
      } catch (e) {
        // Optional: console.error(e)
        setPosts([])
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [currentPage])

  // Mapping ke shape UI lama (id, slug, title, excerpt, image, date)
  const currentBlogs = useMemo(() => {
    return posts.map((p, idx) => ({
      id: p._id ?? `${p.slug?.current ?? "post"}-${idx}`,
      slug: p.slug?.current ?? "",
      title: p.title ?? "",
      excerpt: toExcerpt(p.content),
      image: p.coverImage ? urlFor(p.coverImage).width(1200).height(800).url() : "/placeholder.png",
      date: p.date, // ISO string
    }))
  }, [posts])

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Title Section */}
      <motion.div className="pt-20 pb-12 px-8 text-center" initial="hidden" animate="visible" variants={titleVariants}>
        <h1 className="text-5xl md:text-6xl font-bold text-[#f5f1e8] tracking-tight">Shunhaji Blog</h1>
        <motion.div
          className="h-1 w-24 bg-gradient-to-r from-[#4a9d6f] to-[#2d6a4f] mx-auto mt-6"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
      </motion.div>

      {/* Blog Grid */}
      <motion.div
        className="max-w-7xl mx-auto px-8 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <div className="text-center text-[#b8b8b8] py-20">Loading posts…</div>
        ) : currentBlogs.length === 0 ? (
          <div className="text-center text-[#b8b8b8] py-20">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog) => (
              <motion.div key={blog.id} variants={itemVariants} whileHover={{ y: -8 }} className="group cursor-pointer">
                <Link href={`/blog/${blog.slug}`}>
                  <div className="bg-[#262727] rounded-lg overflow-hidden border border-[#3a3a3a] hover:border-[#4a9d6f] transition-colors duration-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-[#1a1a1a]">
                      <motion.img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#f5f1e8] mb-3 line-clamp-2 group-hover:text-[#4a9d6f] transition-colors duration-300">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-[#b8b8b8] line-clamp-3 mb-4">{blog.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#808080]">
                          {new Date(blog.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <motion.span className="text-[#4a9d6f] text-sm font-semibold" whileHover={{ x: 4 }}>
                          Read →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="flex items-center justify-center gap-4 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1 || loading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg border border-[#3a3a3a] text-[#f5f1e8] hover:border-[#4a9d6f] hover:text-[#4a9d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              onClick={() => setCurrentPage(page)}
              disabled={loading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                currentPage === page
                  ? "bg-[#4a9d6f] text-[#1a1a1a]"
                  : "border border-[#3a3a3a] text-[#f5f1e8] hover:border-[#4a9d6f] hover:text-[#4a9d6f]"
              }`}
            >
              {page}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || loading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg border border-[#3a3a3a] text-[#f5f1e8] hover:border-[#4a9d6f] hover:text-[#4a9d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <ChevronRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  )
}
