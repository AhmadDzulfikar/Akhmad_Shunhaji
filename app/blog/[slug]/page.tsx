"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

// (opsional, kalau kamu pakai)
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// === SANITY WIRING ===
import { groq } from "next-sanity"
import { sanityClient } from "@/lib/sanity.client"
import { urlFor } from "@/lib/image"
import RichText from "@/components/RichText"

// -------- GROQ QUERIES --------
const POST_QUERY = groq`*[_type=="post" && slug.current==$slug][0]{
  _id,
  title,
  coverImage,
  content,
  "date": coalesce(publishedAt, _createdAt)
}`

const RELATED_QUERY = groq`*[_type=="post" && slug.current!=$slug]
| order(coalesce(publishedAt, _createdAt) desc)[0...2]{
  _id,
  title,
  "slug": slug.current,
  coverImage,
  content,
  "date": coalesce(publishedAt, _createdAt)
}`

// Helper: bikin excerpt singkat dari Portable Text (kalau mau ditampilkan di "More Articles")
type SanityBlock = { _type: string; children?: { _type: string; text?: string }[] }
function toExcerpt(blocks?: SanityBlock[], maxLen = 120): string {
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

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [post, setPost] = useState<{
    _id: string
    title: string
    coverImage?: any
    content?: any
    date: string
  } | null>(null)

  const [related, setRelated] = useState<
    { _id: string; title: string; slug: string; coverImage?: any; content?: any; date: string }[]
  >([])

  // Fetch detail + related
  useEffect(() => {
    let active = true
    setLoading(true)
    setNotFound(false)

    ;(async () => {
      try {
        const doc = await sanityClient.fetch(POST_QUERY, { slug })
        if (!active) return
        if (!doc) {
          setNotFound(true)
          setPost(null)
          setRelated([])
          return
        }
        setPost(doc)

        const rel = await sanityClient.fetch(RELATED_QUERY, { slug })
        if (!active) return
        setRelated(rel || [])
      } catch {
        if (!active) return
        setNotFound(true)
        setPost(null)
        setRelated([])
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [slug])

  const relatedMapped = useMemo(() => {
    return (related || []).map((r) => ({
      id: r._id,
      slug: r.slug,
      title: r.title,
      excerpt: toExcerpt(r.content),
      image: r.coverImage ? urlFor(r.coverImage).width(800).height(500).url() : "/placeholder.png",
      date: r.date,
    }))
  }, [related])

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center text-[#b8b8b8]">Loading…</div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#f5f1e8] mb-4">Blog Not Found</h1>
          <Link href="/blog" className="text-[#4a9d6f] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const coverUrl = post.coverImage ? urlFor(post.coverImage).width(1600).height(900).url() : "/placeholder.svg"

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
        transition={{ duration: 0.6 }}
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

        {/* Meta Info */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8 pb-8 border-b border-[#3a3a3a]">
          <span className="text-[#808080]">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-[#808080]">•</span>
          <span className="text-[#808080]">By Akhmad Shunhaji</span>
        </motion.div>

        {/* Body (Portable Text) */}
        <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
          <RichText value={post.content} />
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="h-px bg-gradient-to-r from-[#4a9d6f] to-transparent my-12" />

        {/* Related Articles */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-[#f5f1e8] mb-8">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedMapped.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                <motion.div
                  className="bg-[#262727] rounded-lg overflow-hidden border border-[#3a3a3a] hover:border-[#4a9d6f] transition-colors duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-32 overflow-hidden">
                    <motion.img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#f5f1e8] group-hover:text-[#4a9d6f] transition-colors duration-300">
                      {r.title}
                    </h3>
                    <p className="text-sm text-[#808080] mt-2 line-clamp-2">{r.excerpt}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* (opsional) <Footer /> kalau mau ditampilkan */}
    </div>
  )
}
