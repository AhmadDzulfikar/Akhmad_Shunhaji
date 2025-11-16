"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

type Post = {
  id: number | string
  slug: string
  title: string
  content: string
  imageUrl?: string | null
  createdAt: string // ISO
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/posts/${slug}`, { cache: "no-store" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Post = await res.json()
        if (!alive) return
        setPost(data ?? null)
      } catch (e: any) {
        if (!alive) return
        setError(e?.message ?? "Failed to load")
        setPost(null)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [slug])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center text-[#b8b8b8]">Loading…</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#f5f1e8] mb-2">Blog Not Found</h1>
          {error && <p className="text-sm text-red-400 mb-3">Error: {error}</p>}
          <Link href="/blog" className="text-[#4a9d6f] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const coverUrl = post.imageUrl || "/placeholder.png"

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Back Button */}
      <motion.div
        className="pt-8 px-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#4a9d6f] hover:text-[#f5f1e8] transition-colors duration-300"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>
      </motion.div>

      {/* Featured Image */}
      <motion.div
        className="w-full h-96 md:h-[500px] overflow-hidden mt-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <img src={coverUrl} alt={post.title} className="w-full h-full object-cover" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="max-w-4xl mx-auto px-8 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-[#f5f1e8] mb-4">
          {post.title}
        </motion.h1>

        {/* Meta */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8 pb-8 border-b border-[#3a3a3a]">
          <span className="text-[#808080]">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-[#808080]">•</span>
          <span className="text-[#808080]">By Akhmad Shunhaji</span>
        </motion.div>

        {/* Body (paragraf dari string) */}
        <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
          {post.content
            ?.split(/\n{2,}/g)
            .map((p, i) => (
              <p key={i} className="text-[#b8b8b8] text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                {p}
              </p>
            ))}
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="h-px bg-gradient-to-r from-[#4a9d6f] to-transparent my-12" />
      </motion.div>
    </div>
  )
}
