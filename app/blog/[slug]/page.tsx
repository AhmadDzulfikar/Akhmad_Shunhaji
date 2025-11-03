"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Sample blog data (same as in blog/page.tsx)
const allBlogs = [
  {
    id: 1,
    slug: "the-power-of-storytelling",
    title: "The Power of Storytelling",
    excerpt: "Discover how storytelling shapes our understanding of the world and connects us as human beings.",
    image: "/storytelling-scene.png",
    content:
      "Storytelling is one of the most powerful tools we have as humans. It allows us to share experiences, emotions, and knowledge across generations. From ancient cave paintings to modern novels, stories have been the backbone of human culture.\n\nIn this article, we explore how storytelling influences our perception of reality and shapes our identities. Throughout history, stories have been used to teach, inspire, and connect people across cultures and time periods.\n\nThe power of storytelling lies in its ability to create empathy and understanding. When we listen to or read stories, we step into the shoes of characters and experience their worlds. This emotional connection is what makes stories so memorable and impactful.\n\nWhether you're writing fiction, creating content, or simply sharing your experiences, understanding the power of storytelling can help you communicate more effectively and create meaningful connections with your audience.",
    date: "2024-01-15",
  },
  {
    id: 2,
    slug: "writing-across-cultures",
    title: "Writing Across Cultures",
    excerpt: "Exploring how writers navigate cultural boundaries and create universal narratives.",
    image: "/cultures.jpg",
    content:
      "Writing across cultures requires sensitivity, research, and a deep understanding of different perspectives. When we write about cultures different from our own, we have a responsibility to represent them authentically.\n\nThis article discusses the challenges and rewards of cross-cultural writing. It explores how writers can navigate cultural differences while creating stories that resonate with diverse audiences.\n\nOne of the key challenges in cross-cultural writing is avoiding stereotypes and clichés. Writers must do thorough research and engage with people from the cultures they're writing about to ensure authentic representation.\n\nThe rewards of cross-cultural writing are immense. It allows us to build bridges between communities, foster understanding, and create literature that reflects the diversity of our world.",
    date: "2024-01-10",
  },
  {
    id: 3,
    slug: "character-development-101",
    title: "Character Development 101",
    excerpt: "Learn the essential techniques for creating compelling and believable characters.",
    image: "/diverse-group-characters.png",
    content:
      "Great characters are the heart of any story. They drive the plot, engage readers, and make narratives memorable. In this comprehensive guide, we explore the fundamentals of character development, from creating backstories to understanding motivations.\n\nCharacters should be complex and multidimensional. They should have strengths and weaknesses, desires and fears. The most compelling characters are those who grow and change throughout the story.\n\nWhen developing characters, consider their background, personality, values, and goals. What drives them? What are they afraid of? How do they interact with other characters?\n\nEffective character development makes readers care about what happens to your characters, which in turn makes them invested in your story.",
    date: "2024-01-05",
  },
  {
    id: 4,
    slug: "the-art-of-dialogue",
    title: "The Art of Dialogue",
    excerpt: "Master the craft of writing realistic and engaging conversations between characters.",
    image: "/dialogue.jpg",
    content:
      "Dialogue is more than just characters talking to each other. It reveals personality, advances the plot, and creates tension. Learn how to write dialogue that feels natural while serving your story's purpose.\n\nGood dialogue should sound like real conversation, but it should be more purposeful and concise than actual speech. Every line of dialogue should reveal something about the character or move the story forward.\n\nPay attention to how different characters speak. Each character should have a distinct voice that reflects their background, education, personality, and emotional state.\n\nDialogue is also an excellent tool for showing conflict and tension between characters. Through their words and how they interact, readers can understand the dynamics of relationships.",
    date: "2023-12-28",
  },
  {
    id: 5,
    slug: "finding-your-voice",
    title: "Finding Your Voice",
    excerpt: "Discover your unique writing voice and develop a style that's authentically yours.",
    image: "/abstract-voice.png",
    content:
      "Every writer has a unique voice waiting to be discovered. Your voice is the combination of your perspective, experiences, and writing style. This article guides you through the process of finding and developing your authentic writing voice.\n\nYour writing voice is what makes your work distinctly yours. It's the way you choose words, structure sentences, and express ideas. It's influenced by your background, your reading habits, and your personality.\n\nTo find your voice, write regularly and experiment with different styles. Read widely to expose yourself to different voices and techniques. Pay attention to what resonates with you and what feels natural to your writing.\n\nDon't try to imitate other writers. Instead, focus on developing your own unique perspective and style. Your authentic voice is what will connect with readers and make your work memorable.",
    date: "2023-12-20",
  },
  {
    id: 6,
    slug: "editing-and-revision",
    title: "Editing and Revision",
    excerpt: "Transform your first draft into a polished masterpiece through effective editing.",
    image: "/editing-tools.png",
    content:
      "Writing is rewriting. The editing process is where good writing becomes great writing. Learn strategies for self-editing, getting feedback, and revising your work to perfection.\n\nThere are different levels of editing: developmental editing (big picture), line editing (sentence level), and copyediting (grammar and mechanics). Each level serves a different purpose in refining your work.\n\nWhen editing, take breaks between writing and editing. Fresh eyes will help you see problems you might have missed. Read your work aloud to catch awkward phrasing and rhythm issues.\n\nDon't be afraid to cut material that doesn't serve your story. Sometimes the best editing involves removing unnecessary words, scenes, or even characters. Every element should contribute to the overall impact of your work.",
    date: "2023-12-15",
  },
  {
    id: 7,
    slug: "inspiration-and-creativity",
    title: "Inspiration and Creativity",
    excerpt: "Overcome writer's block and unlock your creative potential.",
    image: "/abstract-creativity.png",
    content:
      "Creativity doesn't always strike when we need it. This article explores practical techniques for finding inspiration, maintaining motivation, and pushing through creative blocks.\n\nWriter's block is a common challenge, but it's not insurmountable. Sometimes the best way to overcome it is to simply start writing, even if what you write seems terrible at first. The act of writing often leads to inspiration.\n\nKeep a journal or notebook to capture ideas as they come to you. Read widely, travel, have conversations, and engage with the world around you. Inspiration often comes from unexpected places.\n\nEstablish a regular writing routine. Consistency helps train your creative mind and makes it easier to access your creativity when you sit down to write.",
    date: "2023-12-10",
  },
  {
    id: 8,
    slug: "publishing-your-work",
    title: "Publishing Your Work",
    excerpt: "Navigate the publishing industry and get your work in front of readers.",
    image: "/publishing.jpg",
    content:
      "Whether you choose traditional publishing or self-publishing, understanding your options is crucial. This guide covers the publishing landscape and helps you make informed decisions about your writing career.\n\nTraditional publishing involves working with a publisher who handles editing, design, printing, and distribution. Self-publishing gives you more control but requires you to handle these aspects yourself.\n\nBefore pursuing publication, make sure your work is polished and ready. Get feedback from beta readers and consider hiring a professional editor. A well-edited manuscript is more likely to be accepted by publishers or to succeed in the self-publishing market.\n\nResearch agents and publishers that work with your genre. Follow submission guidelines carefully. Rejection is a normal part of the publishing process, so don't get discouraged.",
    date: "2023-12-05",
  },
  {
    id: 9,
    slug: "the-writer-community",
    title: "The Writer Community",
    excerpt: "Connect with other writers and build meaningful relationships in the literary world.",
    image: "/diverse-community-gathering.png",
    content:
      "Writing can be a solitary pursuit, but connecting with other writers enriches the experience. Learn how to find writing communities, workshops, and mentors who can support your journey.\n\nWriting groups and workshops provide valuable feedback and support. They help you improve your craft and keep you motivated. Whether online or in-person, these communities offer opportunities to learn from other writers.\n\nFinding a mentor can accelerate your growth as a writer. A mentor can provide guidance, feedback, and encouragement based on their experience.\n\nThe writing community is generally supportive and collaborative. Don't be afraid to reach out, share your work, and build relationships with other writers. These connections can lead to friendships, collaborations, and opportunities.",
    date: "2023-11-28",
  },
  {
    id: 10,
    slug: "research-for-writers",
    title: "Research for Writers",
    excerpt: "Master the art of research to add authenticity and depth to your stories.",
    image: "/research-concept.png",
    content:
      "Good research is the foundation of believable fiction. Whether you're writing historical fiction or contemporary stories, thorough research adds credibility and richness to your narratives.\n\nResearch helps you create authentic settings, accurate details, and believable characters. It allows you to explore topics deeply and bring expertise to your writing.\n\nThere are many research methods available: reading books and articles, conducting interviews, visiting locations, and using online resources. The key is to be thorough and to verify your sources.\n\nDon't let research overwhelm your writing process. Do enough research to feel confident about your subject, but don't get so caught up in research that you never start writing. You can always do additional research during the revision process.",
    date: "2023-11-20",
  },
  {
    id: 11,
    slug: "genre-exploration",
    title: "Genre Exploration",
    excerpt: "Understand different genres and find where your writing fits best.",
    image: "/genre.jpg",
    content:
      "Each genre has its own conventions, expectations, and audience. This article explores various genres and helps you understand which might be the best fit for your writing style and interests.\n\nGenres include fiction (literary, mystery, romance, science fiction, fantasy, horror) and non-fiction (memoir, essay, journalism, self-help). Each has distinct characteristics and reader expectations.\n\nUnderstanding genre conventions helps you write more effectively within that genre. However, don't be constrained by genre rules. Many successful works blend genres or subvert conventions in creative ways.\n\nChoose a genre that excites you and that you read regularly. Your passion for the genre will shine through in your writing.",
    date: "2023-11-15",
  },
  {
    id: 12,
    slug: "the-writing-journey",
    title: "The Writing Journey",
    excerpt: "Reflections on the challenges and rewards of a life dedicated to writing.",
    image: "/writing-process.png",
    content:
      "The path of a writer is filled with challenges, rejections, and triumphs. This personal essay reflects on the writing journey and offers encouragement to aspiring writers.\n\nBecoming a writer requires dedication, persistence, and a willingness to face rejection. But the rewards are immense. There's nothing quite like the satisfaction of completing a manuscript or seeing your work published.\n\nThe writing journey is unique for each writer. There's no single path to success. Some writers publish their first book quickly, while others spend years perfecting their craft before publication.\n\nWhat matters is that you keep writing. Write because you love it, because you have stories to tell, because you want to connect with readers. The journey itself is the reward.",
    date: "2023-11-10",
  },
  {
    id: 13,
    slug: "narrative-structure",
    title: "Narrative Structure",
    excerpt: "Explore different narrative structures and how to choose the right one for your story.",
    image: "/narrative.jpg",
    content:
      "How you structure your narrative affects how readers experience your story. From linear narratives to non-linear storytelling, learn about different structural approaches.\n\nLinear narratives follow a chronological order from beginning to end. Non-linear narratives might use flashbacks, multiple timelines, or other techniques to tell the story.\n\nThe structure you choose should serve your story and enhance the reader's experience. Consider what structure will best convey your themes and engage your audience.\n\nExperiment with different structures. Some stories work best told chronologically, while others benefit from a more complex structure that mirrors the protagonist's internal journey.",
    date: "2023-11-05",
  },
  {
    id: 14,
    slug: "world-building",
    title: "World Building",
    excerpt: "Create immersive worlds that captivate readers and bring your stories to life.",
    image: "/worldbuilding.jpg",
    content:
      "Whether you're writing fantasy, science fiction, or contemporary fiction, world-building is essential. Learn how to create detailed, believable worlds that enhance your narratives.\n\nWorld-building involves creating the setting, culture, history, and rules of your fictional world. It includes details about geography, politics, economics, religion, and social structures.\n\nGood world-building is invisible to the reader. They should feel immersed in the world without being overwhelmed by exposition. Reveal details naturally through the story.\n\nConsistency is key in world-building. Keep track of details about your world to ensure consistency throughout your narrative.",
    date: "2023-10-28",
  },
  {
    id: 15,
    slug: "emotional-resonance",
    title: "Emotional Resonance",
    excerpt: "Write stories that touch hearts and create lasting emotional connections.",
    image: "/emotion.jpg",
    content:
      "The most memorable stories are those that resonate emotionally with readers. This article explores techniques for creating emotional depth and authenticity in your writing.\n\nEmotional resonance comes from authentic characters, meaningful conflicts, and genuine human experiences. Readers connect with stories that reflect their own emotions and experiences.\n\nTo create emotional resonance, focus on the internal lives of your characters. Show their thoughts, feelings, and motivations. Let readers see the world through their eyes.\n\nDon't shy away from difficult emotions. Stories that explore sadness, anger, fear, and other complex emotions often resonate most deeply with readers.",
    date: "2023-10-20",
  },
  {
    id: 16,
    slug: "writing-for-change",
    title: "Writing for Change",
    excerpt: "Use your writing as a tool for social impact and meaningful change.",
    image: "/change.jpg",
    content:
      "Writers have the power to influence society and inspire change. This article discusses how to use your writing voice to address important issues and make a difference.\n\nWriting can raise awareness about social issues, challenge injustice, and inspire action. Many important social movements have been driven by powerful writing.\n\nWhen writing about social issues, do your research and approach the topic with sensitivity and nuance. Avoid oversimplification and stereotypes. Present multiple perspectives and encourage readers to think critically.\n\nYour writing can be a force for good. Use your voice to tell stories that matter and to advocate for the changes you want to see in the world.",
    date: "2023-10-15",
  },
]

export default function BlogDetailPage() {

  const params = useParams()
  const slug = params.slug as string

  const blog = allBlogs.find((b) => b.slug === slug)

  if (!blog) {
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
        <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-full object-cover" />
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
          {blog.title}
        </motion.h1>

        {/* Meta Info */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8 pb-8 border-b border-[#3a3a3a]">
          <span className="text-[#808080]">
            {new Date(blog.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-[#808080]">•</span>
          <span className="text-[#808080]">By Akhmad Shunhaji</span>
        </motion.div>

        {/* Body Text */}
        <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
          {blog.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-[#b8b8b8] text-lg leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="h-px bg-gradient-to-r from-[#4a9d6f] to-transparent my-12" />

        {/* Related Articles */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-[#f5f1e8] mb-8">More Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allBlogs
              .filter((b) => b.id !== blog.id)
              .slice(0, 2)
              .map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blog/${relatedBlog.slug}`} className="group">
                  <motion.div
                    className="bg-[#262727] rounded-lg overflow-hidden border border-[#3a3a3a] hover:border-[#4a9d6f] transition-colors duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <motion.img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#f5f1e8] group-hover:text-[#4a9d6f] transition-colors duration-300">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-[#808080] mt-2">{relatedBlog.excerpt}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
