"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type MouseEvent, useEffect, useState } from "react"
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
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (
      href !== "/" &&
      (pathname === href || pathname.startsWith(`${href}/`))
    ) {
      return true
    }
    return false
  }

  useEffect(() => {
    setPendingHref(null)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleNavigate = (
    href: string,
    event?: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (
      event &&
      (event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0)
    ) {
      return
    }

    if (!isActive(href)) {
      setPendingHref(href)
    }
  }

  const isNavigating = Boolean(pendingHref)

  return (
    <motion.nav
      className="relative bg-[#262727] px-4 md:px-8 py-4 md:py-6 sticky top-0 z-50 border-b border-[#3a3a3a]"
      variants={navVariants}
      initial="hidden"
      animate="visible"
      aria-busy={isNavigating}
    >
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-[#3a3a3a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full w-1/3 bg-[#4a9d6f]"
              initial={{ x: "-100%" }}
              animate={{ x: "300%" }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <motion.div
            className="text-lg md:text-xl font-bold tracking-widest text-[#f5f1e8] uppercase"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              onClick={(event) => {
                handleNavigate("/", event)
                closeMobileMenu()
              }}
              className="transition-colors duration-300 hover:text-[#4a9d6f]"
            >
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
                whileHover={{ y: -1 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  onClick={(event) => handleNavigate(item.href, event)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`text-sm tracking-wide uppercase transition-colors duration-300 ${
                    isActive(item.href)
                      ? "text-[#4a9d6f]"
                      : "text-[#f5f1e8] hover:text-[#4a9d6f]"
                  }`}
                >
                  <span className="relative inline-flex min-w-12 items-center justify-center">
                    {item.label}
                    {pendingHref === item.href && (
                      <span
                        className="absolute -right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#4a9d6f] animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </span>
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
                      onClick={(event) => {
                        handleNavigate(item.href, event)
                        closeMobileMenu()
                      }}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`block py-3 px-4 rounded-lg text-base tracking-wide uppercase transition-all duration-300 ${
                        isActive(item.href) || pendingHref === item.href
                          ? "text-[#4a9d6f] bg-[#4a9d6f]/10"
                          : "text-[#f5f1e8] hover:bg-[#3a3a3a]"
                      }`}
                    >
                      <span className="flex min-h-6 items-center justify-between gap-3">
                        {item.label}
                        {pendingHref === item.href && (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-[#4a9d6f] animate-pulse"
                            aria-hidden="true"
                          />
                        )}
                      </span>
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
