"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "BOOKS", href: "/books" },
  { label: "BLOG", href: "/blog" },
  { label: "CONTACT", href: "/contact" },
]

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
  hover: {
    color: "#4a9d6f",
    transition: { duration: 0.3 },
  },
}

interface NavbarProps {
  currentPage?: string
}

export function Navbar({ currentPage }: NavbarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href === "/about" && pathname === "/about") return true
    return false
  }

  return (
    <motion.nav
      className="bg-[#262727] px-8 py-6 sticky top-0 z-50 border-b border-[#3a3a3a]"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <motion.div
          className="text-xl font-bold tracking-widest text-[#f5f1e8] uppercase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Akhmad Shunhaji
        </motion.div>

        {/* Menu */}
        <motion.div
          className="flex gap-8 items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {navItems.map((item, i) => (
            <motion.div
              key={item.label}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="relative"
            >
              <Link
                href={item.href}
                className="text-sm tracking-wide text-[#f5f1e8] uppercase transition-colors duration-300"
              >
                {item.label}
              </Link>
              {isActive(item.href) && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#4a9d6f] w-full"
                  layoutId="underline"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.nav>
  )
}
