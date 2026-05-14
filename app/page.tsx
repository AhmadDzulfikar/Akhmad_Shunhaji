import { Navbar } from "@/components/navbar"
import { AboutSection } from "@/components/about-section"
import { BooksSection } from "@/components/books-section"
import { Footer } from "@/components/footer"
import { getBooksArchiveData } from "@/lib/books"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function Home() {
  const books = (await getBooksArchiveData()).slice(0, 4)

  return (
    <main className="bg-[#1a1a1a] min-h-screen">
      <Navbar />
      <AboutSection />
      <BooksSection books={books} />
      <Footer />
    </main>
  )
}
