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
            <Image src="/author-portrait.jpg" alt="Akhmad Shunhaji" fill className="object-cover" />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.p className="text-[#d4d4d4] leading-relaxed text-lg" variants={itemVariants}>
            Saya adalah seorang penulis dan penulis buku yang berdedikasi untuk menciptakan karya-karya yang
            menginspirasi dan menggerakkan hati pembaca. Dengan pengalaman lebih dari satu dekade dalam industri
            penerbitan, saya telah mengembangkan gaya penulisan yang unik dan menarik.
          </motion.p>

          <motion.p className="text-[#d4d4d4] leading-relaxed text-lg" variants={itemVariants}>
            Setiap buku yang saya tulis adalah hasil dari riset mendalam, refleksi pribadi, dan komitmen untuk
            memberikan nilai kepada pembaca. Saya percaya bahwa sastra memiliki kekuatan untuk mengubah perspektif dan
            menginspirasi perubahan positif.
          </motion.p>

          <motion.button
            className="px-8 py-3 border-2 border-[#4a9d6f] text-[#4a9d6f] rounded-full font-semibold uppercase tracking-wide hover:bg-[#4a9d6f] hover:text-[#262727] transition-all duration-300"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read More
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}
