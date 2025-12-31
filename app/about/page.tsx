"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"

// gunakan cubic-bezier agar lolos typing framer-motion di build
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

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
    transition: { duration: 0.8, ease: EASE_OUT },
  },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(74, 157, 111, 0.2)",
    transition: { duration: 0.3, ease: EASE_OUT },
  },
}

const timelineVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
}

export default function AboutPage() {
  const bioText = [
    "Saya menerima amanah utama sebagai Ketua Program Studi Magister Manajemen Pendidikan Islam (MPI) Universitas PTIQ Jakarta—rumah akademik tempat saya bertumbuh, berkarya, dan menjaga arah pengembangan keilmuan manajemen pendidikan Islam. Di sini, fokus saya adalah memastikan prodi berjalan dengan ritme yang sehat: kurikulumnya relevan, layanan akademiknya rapi, budaya risetnya hidup, dan mutu pembelajarannya terus bergerak naik lewat perbaikan yang nyata, bukan sekadar bagus di atas kertas.",
    "Di saat yang sama, saya juga mengemban tanggung jawab sebagai Ketua STAI Fatahillah Serpong, Banten. Saya melihat kampus sebagai rumah bersama yang perlu ditata dengan hangat sekaligus tertib—agar mahasiswa merasa aman untuk bertumbuh, dosen punya ruang untuk berkembang, dan organisasi bergerak dengan arah yang jelas. Karena itu, saya banyak menaruh perhatian pada penguatan tata kelola, penjaminan mutu, dan kebiasaan kerja yang sederhana namun konsisten: yang mudah dijalankan, mudah dibuktikan, dan benar-benar terasa dampaknya.",
    "Di tingkat jejaring, saya dipercaya menjadi Ketua APTIKIS Jakarta–Banten (2024-2027). Amanah ini membuat saya semakin yakin bahwa kemajuan perguruan tinggi bukan hanya urusan masing-masing kampus, tetapi juga soal saling menguatkan. Saya berusaha merawat ruang kolaborasi antarkampus—berbagi praktik baik, berdiskusi tentang kebijakan, dan menumbuhkan iklim peningkatan mutu yang tidak melelahkan, tetapi justru memberi harapan dan energi.",
    "Di luar dunia kampus, saya juga menjalankan khidmah sebagai Rois Syuriah MWC NU Kramatjati, Jakarta Timur (2021-2026). Bagi saya, ini bukan sekadar peran struktural, melainkan kesempatan untuk menjaga nilai, adab, dan keteduhan sosial di tengah kehidupan yang cepat dan sering bising.",
    "Semua amanah ini pada akhirnya bertemu di satu titik yang sama: ikhtiar agar pendidikan dan pelayanan publik berjalan lebih manusiawi—tertata, bermakna, dan menghadirkan kemaslahatan yang bisa dirasakan.",
  ]

  const roles = [
    { title: "Ketua Prodi Magister MPI", institution: "Universitas PTIQ Jakarta", description: "Mengelola program studi dengan fokus pada kurikulum relevan dan mutu pembelajaran" },
    { title: "Ketua STAI Fatahillah", institution: "Serpong, Banten", description: "Memimpin dengan penguatan tata kelola dan penjaminan mutu" },
    { title: "Ketua APTIKIS", institution: "Jakarta–Banten (2024-2027)", description: "Merawat kolaborasi antarkampus dan peningkatan mutu bersama" },
    { title: "Rois Syuriah MWC NU", institution: "Kramatjati, Jakarta Timur (2021-2026)", description: "Menjaga nilai, adab, dan keteduhan sosial" },
  ]

  const timeline = [
    { year: "2021", event: "Menjabat sebagai Rois Syuriah MWC NU Kramatjati" },
    { year: "2024", event: "Dipercaya sebagai Ketua APTIKIS Jakarta–Banten" },
    { year: "Sekarang", event: "Ketua Prodi Magister MPI Universitas PTIQ Jakarta" },
    { year: "Sekarang", event: "Ketua STAI Fatahillah Serpong, Banten" },
  ]

  return (
    <main className="bg-[#1a1a1a] min-h-screen">
      <Navbar currentPage="ABOUT" />

      {/* Hero Section with Title */}
      <motion.div
        className="relative pt-24 pb-8 px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-[#f5f1e8] tracking-wide text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT }}
          >
            Mengenal Akhmad Shunhaji
          </motion.h1>
        </div>
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
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  <Image src="/author-portrait.webp" alt="Akhmad Shunhaji" fill className="object-cover" priority />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-0"
                    whileHover={{ opacity: 0.3 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
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
        transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
        viewport={{ once: true }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#4a9d6f] to-transparent" />
      </motion.div>

      {/* Awards Section */}
      <motion.section
        className="px-8 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-[#f5f1e8] mb-12 tracking-wide"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            viewport={{ once: true }}
          >
            Amanah & Peran
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {roles.map((role, index) => (
              <motion.div
                key={index}
                className="bg-[#262727] p-6 rounded-lg border border-[#3a3a3a] hover:border-[#4a9d6f]"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div className="flex items-start gap-4">
                  <motion.div
                    className="w-3 h-3 mt-2 bg-[#4a9d6f] rounded-full flex-shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: EASE_OUT }}
                    viewport={{ once: true }}
                  />
                  <div>
                    <h3 className="text-[#f5f1e8] font-semibold text-lg mb-1">{role.title}</h3>
                    <p className="text-[#4a9d6f] text-sm mb-2">{role.institution}</p>
                    <p className="text-[#a8a39e] text-sm">{role.description}</p>
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
        transition={{ duration: 0.8, ease: EASE_OUT }}
        viewport={{ once: true }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#4a9d6f] to-transparent" />
      </motion.div>

      {/* Timeline Section */}
      <motion.section
        className="px-8 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-[#f5f1e8] mb-12 tracking-wide"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
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
              transition={{ duration: 1, ease: EASE_OUT }}
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
                  transition={{ duration: 0.6, delay: index * 0.1, ease: EASE_OUT }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Content */}
                  <div className="flex-1 md:flex-1">
                    <motion.div
                      className="bg-[#262727] p-6 rounded-lg border border-[#3a3a3a] hover:border-[#4a9d6f]"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
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
                    transition={{ duration: 0.5, delay: index * 0.1, ease: EASE_OUT }}
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
        transition={{ duration: 0.8, ease: EASE_OUT }}
        viewport={{ once: true }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-[#4a9d6f] to-transparent" />
      </motion.div>

      <Footer />
    </main>
  )
}
