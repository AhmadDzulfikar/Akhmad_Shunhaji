"use client"

import { motion } from "framer-motion"
import Image from "next/image"
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT,
    },
  },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, x: -30 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
    },
  },
}

export function AboutSection() {
  return (
    <motion.section
      className="bg-[#262727] py-20 px-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <motion.div className="flex justify-center" variants={imageVariants} whileHover="hover">
          <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden">
            <Image src="/author-portrait.webp" alt="Akhmad Shunhaji" fill className="object-cover" />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.h2 className="text-2xl md:text-3xl font-bold text-[#f5f1e8] tracking-wide" variants={itemVariants}>
            Mengenal Akhmad Shunhaji
          </motion.h2>

          <motion.p className="text-[#d4d4d4] leading-relaxed text-lg" variants={itemVariants}>
            Ketua Program Studi Magister Manajemen Pendidikan Islam (MPI) Universitas PTIQ Jakarta dan Ketua STAI Fatahillah Serpong, Banten. Fokus saya adalah memastikan pendidikan berjalan dengan ritme yang sehat: kurikulumnya relevan, layanan akademiknya rapi, dan mutu pembelajarannya terus bergerak naik.
          </motion.p>

          <motion.p className="text-[#d4d4d4] leading-relaxed text-lg" variants={itemVariants}>
            Dipercaya sebagai Ketua APTIKIS Jakarta–Banten (2024-2027) dan Rois Syuriah MWC NU Kramatjati. Semua amanah ini bertemu di satu titik: ikhtiar agar pendidikan dan pelayanan publik berjalan lebih manusiawi—tertata, bermakna, dan menghadirkan kemaslahatan.
          </motion.p>

          <motion.a
            href="/about"
            className="inline-block px-8 py-3 border-2 border-[#4a9d6f] text-[#4a9d6f] rounded-full font-semibold uppercase tracking-wide hover:bg-[#4a9d6f] hover:text-[#262727] transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read More
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  )
}
