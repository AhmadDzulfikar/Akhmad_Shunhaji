"use client"

import { motion } from "framer-motion"
import { Facebook, Youtube, Instagram } from "lucide-react"

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_IN_OUT: [number, number, number, number] = [0.37, 0, 0.63, 1]

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/shunhaji_09/",
    label: "Facebook",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@AkhmadShunhaji",
    label: "YouTube",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/shunhaji_09/",
    label: "Instagram",
  },
]

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
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
}

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
    },
  },
  hover: {
    scale: 1.2,
    transition: {
      duration: 0.3,
      ease: EASE_IN_OUT,
    },
  },
}

export function Footer() {
  return (
    <motion.footer
      className="bg-[#151414] text-center py-16 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Brand Name */}
        <motion.h2
          className="text-2xl md:text-3xl font-bold tracking-widest text-[#f5f1e8] mb-2 uppercase"
          variants={itemVariants}
        >
          Akhmad Shunhaji
        </motion.h2>

        {/* Copyright */}
        <motion.p className="text-sm text-[#a8a8a8] mb-8" variants={itemVariants}>
          © 2025 Akhmad Shunhaji | All Right Reserved
        </motion.p>

        {/* Social Icons */}
        <motion.div className="flex justify-center gap-6 mb-8" variants={containerVariants}>
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-[#4a9d6f] flex items-center justify-center text-[#4a9d6f] hover:bg-[#4a9d6f] hover:text-[#151414] transition-colors duration-300"
                variants={iconVariants}
                whileHover="hover"
                aria-label={social.label}
              >
                <Icon size={20} />
              </motion.a>
            )
          })}
        </motion.div>

        {/* Divider Line */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[#4a9d6f] to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        />
      </motion.div>
    </motion.footer>
  )
}
