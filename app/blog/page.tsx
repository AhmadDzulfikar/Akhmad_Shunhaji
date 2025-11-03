"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample blog data
const allBlogs = [
  {
    id: 1,
    slug: "the-power-of-storytelling",
    title: "The Power of Storytelling",
    excerpt: "Discover how storytelling shapes our understanding of the world and connects us as human beings.",
    image: "/storytelling-scene.png",
    content:
      "Storytelling is one of the most powerful tools we have as humans. It allows us to share experiences, emotions, and knowledge across generations. From ancient cave paintings to modern novels, stories have been the backbone of human culture. In this article, we explore how storytelling influences our perception of reality and shapes our identities.",
    date: "2024-01-15",
  },
  {
    id: 2,
    slug: "writing-across-cultures",
    title: "Writing Across Cultures",
    excerpt: "Exploring how writers navigate cultural boundaries and create universal narratives.",
    image: "/cultures.jpg",
    content:
      "Writing across cultures requires sensitivity, research, and a deep understanding of different perspectives. When we write about cultures different from our own, we have a responsibility to represent them authentically. This article discusses the challenges and rewards of cross-cultural writing.",
    date: "2024-01-10",
  },
  {
    id: 3,
    slug: "character-development-101",
    title: "Character Development 101",
    excerpt: "Learn the essential techniques for creating compelling and believable characters.",
    image: "/diverse-group-characters.png",
    content:
      "Great characters are the heart of any story. They drive the plot, engage readers, and make narratives memorable. In this comprehensive guide, we explore the fundamentals of character development, from creating backstories to understanding motivations.",
    date: "2024-01-05",
  },
  {
    id: 4,
    slug: "the-art-of-dialogue",
    title: "The Art of Dialogue",
    excerpt: "Master the craft of writing realistic and engaging conversations between characters.",
    image: "/dialogue.jpg",
    content:
      "Dialogue is more than just characters talking to each other. It reveals personality, advances the plot, and creates tension. Learn how to write dialogue that feels natural while serving your story's purpose.",
    date: "2023-12-28",
  },
  {
    id: 5,
    slug: "finding-your-voice",
    title: "Finding Your Voice",
    excerpt: "Discover your unique writing voice and develop a style that's authentically yours.",
    image: "/abstract-voice.png",
    content:
      "Every writer has a unique voice waiting to be discovered. Your voice is the combination of your perspective, experiences, and writing style. This article guides you through the process of finding and developing your authentic writing voice.",
    date: "2023-12-20",
  },
  {
    id: 6,
    slug: "editing-and-revision",
    title: "Editing and Revision",
    excerpt: "Transform your first draft into a polished masterpiece through effective editing.",
    image: "/editing-tools.png",
    content:
      "Writing is rewriting. The editing process is where good writing becomes great writing. Learn strategies for self-editing, getting feedback, and revising your work to perfection.",
    date: "2023-12-15",
  },
  {
    id: 7,
    slug: "inspiration-and-creativity",
    title: "Inspiration and Creativity",
    excerpt: "Overcome writer's block and unlock your creative potential.",
    image: "/abstract-creativity.png",
    content:
      "Creativity doesn't always strike when we need it. This article explores practical techniques for finding inspiration, maintaining motivation, and pushing through creative blocks.",
    date: "2023-12-10",
  },
  {
    id: 8,
    slug: "publishing-your-work",
    title: "Publishing Your Work",
    excerpt: "Navigate the publishing industry and get your work in front of readers.",
    image: "/publishing.jpg",
    content:
      "Whether you choose traditional publishing or self-publishing, understanding your options is crucial. This guide covers the publishing landscape and helps you make informed decisions about your writing career.",
    date: "2023-12-05",
  },
  {
    id: 9,
    slug: "the-writer-community",
    title: "The Writer Community",
    excerpt: "Connect with other writers and build meaningful relationships in the literary world.",
    image: "/diverse-community-gathering.png",
    content:
      "Writing can be a solitary pursuit, but connecting with other writers enriches the experience. Learn how to find writing communities, workshops, and mentors who can support your journey.",
    date: "2023-11-28",
  },
  {
    id: 10,
    slug: "research-for-writers",
    title: "Research for Writers",
    excerpt: "Master the art of research to add authenticity and depth to your stories.",
    image: "/research-concept.png",
    content:
      "Good research is the foundation of believable fiction. Whether you're writing historical fiction or contemporary stories, thorough research adds credibility and richness to your narratives.",
    date: "2023-11-20",
  },
  {
    id: 11,
    slug: "genre-exploration",
    title: "Genre Exploration",
    excerpt: "Understand different genres and find where your writing fits best.",
    image: "/genre.jpg",
    content:
      "Each genre has its own conventions, expectations, and audience. This article explores various genres and helps you understand which might be the best fit for your writing style and interests.",
    date: "2023-11-15",
  },
  {
    id: 12,
    slug: "the-writing-journey",
    title: "The Writing Journey",
    excerpt: "Reflections on the challenges and rewards of a life dedicated to writing.",
    image: "/writing-process.png",
    content:
      "The path of a writer is filled with challenges, rejections, and triumphs. This personal essay reflects on the writing journey and offers encouragement to aspiring writers.",
    date: "2023-11-10",
  },
  {
    id: 13,
    slug: "narrative-structure",
    title: "Narrative Structure",
    excerpt: "Explore different narrative structures and how to choose the right one for your story.",
    image: "/narrative.jpg",
    content:
      "How you structure your narrative affects how readers experience your story. From linear narratives to non-linear storytelling, learn about different structural approaches.",
    date: "2023-11-05",
  },
  {
    id: 14,
    slug: "world-building",
    title: "World Building",
    excerpt: "Create immersive worlds that captivate readers and bring your stories to life.",
    image: "/worldbuilding.jpg",
    content:
      "Whether you're writing fantasy, science fiction, or contemporary fiction, world-building is essential. Learn how to create detailed, believable worlds that enhance your narratives.",
    date: "2023-10-28",
  },
  {
    id: 15,
    slug: "emotional-resonance",
    title: "Emotional Resonance",
    excerpt: "Write stories that touch hearts and create lasting emotional connections.",
    image: "/emotion.jpg",
    content:
      "The most memorable stories are those that resonate emotionally with readers. This article explores techniques for creating emotional depth and authenticity in your writing.",
    date: "2023-10-20",
  },
  {
    id: 16,
    slug: "writing-for-change",
    title: "Writing for Change",
    excerpt: "Use your writing as a tool for social impact and meaningful change.",
    image: "/change.jpg",
    content:
      "Writers have the power to influence society and inspire change. This article discusses how to use your writing voice to address important issues and make a difference.",
    date: "2023-10-15",
  },
]

const BLOGS_PER_PAGE = 12

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(allBlogs.length / BLOGS_PER_PAGE)
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE
  const currentBlogs = allBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE)

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
          disabled={currentPage === 1}
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
          disabled={currentPage === totalPages}
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
