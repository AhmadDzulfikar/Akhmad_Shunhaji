"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(74, 157, 111, 0.2)",
    transition: { duration: 0.3 },
  },
}

const timelineVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export default function AboutPage() {
  const bioText = [
    "Akhmad Shunhaji adalah seorang penulis dan penyair Indonesia yang dikenal karya-karyanya yang mendalam dan penuh makna. Lahir di Jakarta, beliau menjalani pendidikan di berbagai institusi terkemuka dan mengembangkan passion untuk menulis sejak usia dini.",
    "Perjalanan literatur Akhmad dimulai dengan penerbitan puisi pertamanya pada tahun 2010, yang langsung mendapat sambutan positif dari kritikus sastra. Sejak saat itu, beliau terus menghasilkan karya-karya berkualitas tinggi yang menyentuh berbagai tema kehidupan manusia.",
    "Karya-karya Akhmad telah memenangkan berbagai penghargaan bergengsi, termasuk Penghargaan Sastra Nasional dan Beasiswa Penulis Internasional. Beliau juga aktif dalam komunitas sastra global dan sering mengikuti festival literatur internasional.",
    "Selain menulis, Akhmad juga aktif menerjemahkan karya-karya sastra dari berbagai bahasa ke dalam bahasa Indonesia, membawa perspektif baru kepada pembaca lokal. Dedikasi beliau terhadap seni sastra telah menginspirasi banyak penulis muda untuk mengembangkan bakat mereka.",
    "Hingga saat ini, Akhmad terus menulis dan berkontribusi pada perkembangan sastra Indonesia. Karya-karyanya telah diterjemahkan ke dalam berbagai bahasa dan dibaca oleh jutaan pembaca di seluruh dunia, menjadikan beliau salah satu tokoh sastra paling berpengaruh di era modern.",
  ]

  const awards = [
    {
      year: "2023",
      title: "Penghargaan Sastra Nasional",
      description: "Penghargaan tertinggi untuk kontribusi sastra",
    },
    { year: "2022", title: "Beasiswa Penulis Internasional", description: "Fellowship dari institusi sastra global" },
    { year: "2021", title: "Penghargaan Buku Terbaik", description: "Untuk karya 'Mimpi di Tengah Malam'" },
    { year: "2020", title: "Penghargaan Kritikus Sastra", description: "Pengakuan dari komunitas sastra" },
  ]

  const timeline = [
    { year: "2010", event: "Penerbitan puisi pertama 'Suara Hati'" },
    { year: "2013", event: "Menerbitkan novel debut 'Perjalanan Jiwa'" },
    { year: "2016", event: "Mulai menerjemahkan karya sastra internasional" },
    { year: "2019", event: "Menerbitkan koleksi puisi 'Cahaya Malam'" },
    { year: "2023", event: "Karya diterjemahkan ke 15 bahasa" },
  ]

  return (
    <main className="bg-[#1a1a1a] min-h-screen">
      <Navbar currentPage="ABOUT" />

      {/* Hero Section with Blog Button */}
      <motion.div
        className="relative pt-24 pb-12 px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
      </motion.div>

      {/* Main Biography Section */}
      <motion.section className="px-8 py-12" variants={containerVariants} initial="hidden" animate="visible">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Image */}
            <motion.div className="lg:col-span-1 flex justify-center lg:justify-start" variants={imageVariants}>
              <div className="relative w-full max-w-sm">
                <motion.div
                  className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src="/author-portrait.jpg" alt="Akhmad Shunhaji" fill className="object-cover" priority />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-0"
                    whileHover={{ opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Biography Text */}
            <motion.div className="lg:col-span-2 space-y-6" variants={containerVariants}>
              {bioText.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-[#d4cfc4] leading-relaxed text-base lg:text-lg max-w-2xl"
                  variants={itemVariants}
                  custom={index}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Decorative divider */}
      <motion.div
        className="max-w-7xl mx-auto px-8 py-8"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#4a9d6f] to-transparent" />
      </motion.div>

      {/* Awards Section */}
      <motion.section
        className="px-8 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-[#f5f1e8] mb-12 tracking-wide"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Penghargaan & Pengakuan
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {awards.map((award, index) => (
              <motion.div
                key={index}
                className="bg-[#262727] p-6 rounded-lg border border-[#3a3a3a] hover:border-[#4a9d6f]"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div className="flex items-start gap-4">
                  <motion.div
                    className="text-[#4a9d6f] font-bold text-lg min-w-fit"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {award.year}
                  </motion.div>
                  <div>
                    <h3 className="text-[#f5f1e8] font-semibold text-lg mb-2">{award.title}</h3>
                    <p className="text-[#a8a39e] text-sm">{award.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <motion.div
        className="max-w-7xl mx-auto px-8 py-8"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#4a9d6f] to-transparent" />
      </motion.div>

      {/* Timeline Section */}
      <motion.section
        className="px-8 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-[#f5f1e8] mb-12 tracking-wide"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Perjalanan Karir
          </motion.h2>

          <div className="relative">
            {/* Timeline line */}
            <motion.div
              className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4a9d6f] via-[#4a9d6f] to-transparent"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            />

            {/* Timeline items */}
            <motion.div className="space-y-12 md:space-y-16">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  variants={timelineVariants}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Content */}
                  <div className="flex-1 md:flex-1">
                    <motion.div
                      className="bg-[#262727] p-6 rounded-lg border border-[#3a3a3a] hover:border-[#4a9d6f]"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-[#4a9d6f] font-bold text-sm mb-2">{item.year}</p>
                      <p className="text-[#f5f1e8] font-semibold">{item.event}</p>
                    </motion.div>
                  </div>

                  {/* Timeline dot */}
                  <motion.div
                    className="hidden md:flex items-center justify-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-4 h-4 bg-[#4a9d6f] rounded-full border-4 border-[#1a1a1a]" />
                  </motion.div>

                  {/* Spacer */}
                  <div className="flex-1 md:flex-1" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <motion.div
        className="max-w-7xl mx-auto px-8 py-8"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#4a9d6f] to-transparent" />
      </motion.div>

      <Footer />
    </main>
  )
}
