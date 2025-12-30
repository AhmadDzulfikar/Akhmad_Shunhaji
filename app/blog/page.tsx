"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"

const PAGE_SIZE = 12
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

type PostItem = {
  id: number | string
  slug: string
  title: string
  content?: string
  imageUrl?: string | null
  createdAt: string // ISO
}

type ListResponse = {
  items: PostItem[]
  total: number
  page?: number
  pageCount?: number
}

function toExcerpt(input?: string, maxLen = 180) {
  const text = (input || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (!text) return ""
  return text.length <= maxLen ? text : text.slice(0, maxLen - 1).trim() + "…"
}

export default function BlogPage() {
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [error, setError] = useState<string | null>(null)

  // Ambil list posting (12/halaman)
  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/posts?page=${currentPage}&pageSize=${PAGE_SIZE}`, {
          cache: "no-store",
        })
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch /api/posts failed (${res.status}): ${text.slice(0,180)}...`);
        }
        const data: ListResponse = await res.json();
        if (!alive) return
        setPosts(data.items ?? [])
        const pages = data.pageCount ?? Math.max(1, Math.ceil((data.total ?? 0) / PAGE_SIZE))
        setTotalPages(pages || 1)
      } catch (e: any) {
        if (!alive) return
        setError(e?.message ?? "Failed to load posts")
        setPosts([])
        setTotalPages(1)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [currentPage])

  const currentBlogs = useMemo(
    () =>
      posts.map((p, i) => ({
        id: p.id ?? `${p.slug}-${i}`,
        slug: p.slug,
        title: p.title,
        excerpt: toExcerpt(p.content),
        image: p.imageUrl || "/placeholder.png",
        date: p.createdAt,
      })),
    [posts]
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  }
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      {/* Title + Add Blog (hanya saat login) */}
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

          {session?.user && (
            <Link
              href="/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4a9d6f] text-[#1a1a1a] font-semibold hover:opacity-90 transition"
            >
              <Plus size={18} />
              Add Blog
            </Link>
          )}
        </div>
      </motion.div>

      {/* Blog Grid */}
      <motion.div 
        className="max-w-7xl mx-auto px-8 pb-16" 
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        {loading ? (
          <div className="text-center text-[#b8b8b8] py-20">Loading posts…</div>
        ) : error ? (
          <div className="text-center text-red-400 py-20">Error: {error}</div>
        ) : currentBlogs.length === 0 ? (
          <div className="text-center text-[#b8b8b8] py-20">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog, idx) => (
              <motion.div 
                key={blog.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: idx * 0.05 }}
                whileHover={{ y: -8 }} 
                className="group cursor-pointer"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="bg-[#262727] rounded-lg overflow-hidden border border-[#3a3a3a] hover:border-[#4a9d6f] transition-colors duration-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-[#1a1a1a]">
                      <motion.img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
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
        transition={{ delay: 0.2, duration: 0.5, ease: EASE_OUT }}
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
