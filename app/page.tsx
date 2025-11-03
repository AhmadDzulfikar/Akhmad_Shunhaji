"use client"

import { Navbar } from "@/components/navbar"
import { AboutSection } from "@/components/about-section"
import { BooksSection } from "@/components/books-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-[#1a1a1a] min-h-screen">
      <Navbar />
      <AboutSection />
      <BooksSection />
      <Footer />
    </main>
  )
}
