"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

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

const mobileMenuVariants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    }
  },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    }
  },
}

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
}

interface NavbarProps {
  currentPage?: string
}

export function Navbar({ currentPage }: NavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      className="bg-[#262727] px-4 md:px-8 py-4 md:py-6 sticky top-0 z-50 border-b border-[#3a3a3a]"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <motion.div
            className="text-lg md:text-xl font-bold tracking-widest text-[#f5f1e8] uppercase"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" onClick={closeMobileMenu}>
              Akhmad Shunhaji
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div
            className="hidden md:flex gap-8 items-center"
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
                  className={`text-sm tracking-wide uppercase transition-colors duration-300 ${
                    isActive(item.href) ? "text-[#4a9d6f]" : "text-[#f5f1e8]"
                  }`}
                >
                  {item.label}
                </Link>
                {isActive(item.href) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#4a9d6f] w-full"
                    layoutId="underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Hamburger Button */}
          <motion.button
            className="md:hidden text-[#f5f1e8] p-2 hover:bg-[#3a3a3a] rounded-lg transition-colors"
            onClick={toggleMobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="pt-4 pb-2 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    custom={i}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`block py-3 px-4 rounded-lg text-base tracking-wide uppercase transition-all duration-300 ${
                        isActive(item.href)
                          ? "text-[#4a9d6f] bg-[#4a9d6f]/10"
                          : "text-[#f5f1e8] hover:bg-[#3a3a3a]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
