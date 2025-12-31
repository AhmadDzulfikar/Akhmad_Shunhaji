"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]


const booksData = [
  {
    id: 1,
    slug: "aku-kamu-dan-dia",
    title: "Aku, Kamu, DIA",
    author: "Akhmad Shunhaji",
    shortDescription: "Ajakan pelan-pelan untuk berhenti sebentar dari ramainya hari, lalu bertanya dengan jujur: sebenarnya, hidupku sedang ke mana?",
    fullDescription:
      "Buku 'Aku, Kamu, DIA' terasa seperti ajakan pelan-pelan untuk berhenti sebentar dari ramainya hari, lalu bertanya dengan jujur: sebenarnya, hidupku sedang ke mana? Dari awal, buku ini memposisikan diri bukan sebagai bacaan yang 'berat', tapi sebagai teman perjalanan—ringan dibaca, namun arahnya jelas: menuntun kita mengenal diri, memahami orang lain, dan menata hubungan dengan Sang Pencipta.\n\nYang bikin menarik, penulis membingkai hidup lewat tiga pilar yang terasa sederhana tapi 'kena': Aku (diri sendiri), Kamu (sesama), dan DIA (dimensi spiritual). Ketiganya bukan dibahas sebagai teori langit, melainkan sebagai peta praktis untuk hidup yang lebih utuh—dari cara berdamai dengan diri, sampai cara membangun relasi yang lebih sehat, dan menemukan ketenangan yang tidak gampang dibeli oleh apa pun.\n\nDi bagian awal, Anda seperti diajak mengganti cara pandang: mengenal diri bukan tugas yang melelahkan, tapi petualangan paling berharga—karena tanpa 'kompas' itu, kita gampang ikut arus, gampang capek karena mengejar validasi, dan gampang bingung ketika hidup menuntut keputusan.\n\nMasuk ke pembahasan 'Aku', buku ini menyorot hal-hal yang sangat manusiawi: potensi dan keterbatasan, penerimaan diri, pencarian makna, sampai cara membaca emosi dan pikiran agar tidak terus 'dibajak' oleh reaksi sesaat.\n\nLalu ketika berbicara tentang 'Kamu', buku ini mulai merajut sisi sosialnya: tentang seni berinteraksi, komunikasi yang benar-benar nyambung, dan empati yang tidak hanya manis di kata-kata.\n\nDan ketika sampai pada 'DIA', nuansanya jadi lebih menenangkan. Buku ini membawa pembaca pada dimensi habluminallah—bukan sekadar ritual, tapi koneksi batin: syukur, doa, jeda untuk merenung, dan rasa bersandar ketika hidup terasa berat.",
    image: "/aku_kamu_dan_dia.webp",
  },
  {
    id: 2,
    slug: "integrasi-filsafat-islam",
    title: "Integrasi Filsafat Islam dalam Pengembangan Pendidikan",
    author: "Akhmad Shunhaji",
    shortDescription: "Peta besar yang membuat kita paham: pendidikan bukan cuma soal metode mengajar, tapi soal arah hidup.",
    fullDescription:
      "Buku Integrasi Filsafat Islam dalam Pengembangan Pendidikan ini terasa seperti 'peta besar' yang membuat kita paham satu hal: pendidikan bukan cuma soal metode mengajar, tapi soal arah hidup—mau membentuk manusia seperti apa, dengan nilai apa, dan untuk tujuan apa.\n\nMenariknya, buku ini tidak langsung lompat ke istilah-istilah berat. Ia menata pijakan dulu: apa peran filsafat dalam pendidikan, bagaimana tujuan pendidikan dibentuk, nilai apa yang bekerja diam-diam di balik kurikulum, sampai cara pandang tentang pengetahuan dan pembelajaran.\n\nSetelah itu, pembaca diajak bertemu berbagai aliran filsafat—idealisme, realisme, pragmatisme, eksistensialisme, humanisme—bukan untuk dipamerkan, tapi untuk menunjukkan: beda cara pandang akan melahirkan beda tujuan pendidikan.\n\nBagian yang paling 'menggoda untuk diteruskan' adalah ketika buku mulai masuk ke jantung tema: filsafat Islam sebagai fondasi pendidikan. Di sini, gagasannya terasa hangat sekaligus tegas: pendidikan bertumpu pada tauhid, memadukan akal dan wahyu, merawat adab, dan memandang peserta didik secara holistik.\n\nDan puncaknya ada pada kontribusi filsafat Islam untuk pengembangan kurikulum: kurikulum tidak lagi sekadar mengejar prestasi akademik, tetapi juga menumbuhkan iman dan akhlak.",
    image: "/integrasi_filsafat_islam_.webp",
  },
  {
    id: 3,
    slug: "manajemen-cinta-dalam-pendidikan",
    title: "Manajemen Cinta dalam Pendidikan",
    author: "Akhmad Shunhaji",
    shortDescription: "Napas baru untuk ruang kelas—mengingatkan bahwa pendidikan yang hebat selalu punya unsur yang sering hilang: rasa manusia.",
    fullDescription:
      "Buku Manajemen Cinta dalam Pendidikan ini terasa seperti 'napas baru' untuk ruang kelas—bukan karena ia mengajak kita jadi lembek, tapi karena ia mengingatkan bahwa pendidikan yang hebat selalu punya unsur yang sering hilang: rasa manusia. Di sini, cinta diposisikan sebagai fondasi yang bisa mengubah pembelajaran dari sekadar rutinitas menjadi pengalaman yang bermakna dan menumbuhkan.\n\nYang membuatnya menarik, buku ini sejak awal menegaskan bahwa cinta dalam pendidikan bukan sekadar perasaan, melainkan komitmen yang tampak dalam tindakan nyata: perhatian penuh, penghargaan pada keunikan peserta didik, dan upaya menghadirkan suasana belajar yang aman serta kondusif.\n\nBagian yang terasa 'klik' adalah ketika buku ini memecah cinta menjadi hal-hal yang bisa dipegang: ada cinta kasih, cinta sayang, dan cinta perhatian terhadap ilmu—tiga energi yang, ketika digabung, membentuk iklim belajar yang bukan cuma efektif, tapi juga hangat dan sehat.\n\nYang membuat buku ini terasa matang adalah keberaniannya membahas sisi rawan: cinta yang tidak dikelola bisa berubah jadi bias dan favoritisme, memicu kecemburuan dan konflik, bahkan merusak integritas pendidikan.\n\nSingkatnya, buku ini terasa seperti panduan yang menenangkan sekaligus menguatkan: hangat, tapi tetap profesional; manusiawi, tapi tetap terarah.",
    image: "/manajemen_cinta_dalam_pendidikan.webp",
  },
  {
    id: 4,
    slug: "manajemen-cinta-sebagai-hidden-curriculum",
    title: "Manajemen Cinta sebagai Hidden Curriculum di Madrasah",
    author: "Akhmad Shunhaji",
    shortDescription: "Membuka tirai yang selama ini diam-diam menentukan 'warna' sebuah madrasah.",
    fullDescription:
      "Buku 'Manajemen Cinta sebagai Hidden Curriculum di Madrasah' terasa seperti membuka tirai yang selama ini diam-diam menentukan 'warna' sebuah madrasah: bukan hanya apa yang diajarkan, tapi bagaimana madrasah itu membuat orang merasa aman, dihargai, dan disayang. Di halaman-halaman awal, buku ini mengajak pembaca melihat cinta ala Rasulullah Saw sebagai fondasi pendidikan—cinta yang membentuk karakter, bukan sekadar emosi sesaat.\n\nYang menarik, 'cinta' di sini dibersihkan dari salah paham. Ia tidak dipersempit jadi romantika, tetapi diluaskan menjadi kasih sayang, respek, empati, tanggung jawab, dan integritas—sesuatu yang terasa sangat nyata dalam ruang kelas, ruang guru, sampai cara sebuah madrasah memperlakukan perbedaan.\n\nBuku ini juga membuat kita paham kenapa kurikulum tersembunyi sering lebih 'menempel' pada siswa dibanding materi pelajaran. Karena ia hidup lewat kebiasaan: cara guru menyapa, cara menegur, cara mendengar, cara menenangkan kelas.\n\nAda bagian yang rasanya seperti 'peta jalan' sederhana namun kuat: ketika cinta menjadi cara mengelola kelas, ia menciptakan iklim emosional yang positif, melahirkan keteladanan yang bisa ditiru, mendorong komunikasi terbuka, dan menumbuhkan tanggung jawab.\n\nKalau Anda ingin membaca satu buku yang membuat konsep 'pendidikan berkarakter' terasa hangat, masuk akal, dan bisa dipraktikkan—buku ini seperti teman perjalanan: tidak menggurui, tapi pelan-pelan membuat kita ingin pulang ke kelas dengan cara yang lebih lembut, lebih kuat, dan lebih manusiawi.",
    image: "/manajemen_cinta_sebagai_hidden.webp",
  },
  {
    id: 5,
    slug: "konsep-dasar-manajemen-cinta",
    title: "Konsep Dasar Manajemen Cinta dalam Pendidikan",
    author: "Akhmad Shunhaji",
    shortDescription: "Pegangan ringkas yang merapikan cinta jadi konsep yang bisa dipahami cepat—lalu langsung bisa dipakai di kelas maupun di lembaga.",
    fullDescription:
      "Buku 'Konsep Dasar Manajemen Cinta dalam Pendidikan' terasa seperti 'pegangan ringkas' yang akhirnya banyak orang cari: bukan sekadar bicara cinta sebagai slogan, tapi merapikannya jadi konsep yang bisa dipahami cepat—lalu langsung bisa dipakai di kelas maupun di lembaga. Ada nada yang hangat, tapi tetap rapi: pembaca diajak melihat bahwa pendidikan itu bukan cuma mengasah akal, melainkan juga mengolah hati—tanpa kehilangan kedalaman akademiknya.\n\nYang bikin buku ini bikin betah adalah cara ia mendefinisikan Manajemen Cinta dengan jernih: tata kelola dan kepemimpinan yang manusiawi, berbasis bukti, menggabungkan empati yang terlatih, keadilan, dan kinerja yang bisa diukur—jadi keputusan tidak berhenti pada 'niat baik', tapi benar-benar terbukti manfaatnya.\n\nLalu, buku ini punya 'tulang punggung' yang gampang diingat: nilai-nilai Qur'ani–Nabawi (rahmah, 'adl, amanah, ihsan, syûrâ) diikat ke dua mesin kerja yang praktis—prinsip 6P dan Siklus PDLR—sehingga cinta tidak mengambang, tapi turun jadi sistem yang konsisten.\n\nBagian yang paling memancing 'wah ini bisa langsung dieksekusi' adalah ketika buku ini menunjukkan contoh kebijakan nyata: dari bahasa empatik sampai rubrik penilaian transparan, dari SLA umpan balik sampai forum syûrâ bulanan.\n\nYang membuat buku ini terasa matang adalah detail 'alat-alat kecil' yang sering dilupakan: decision log yang rapi, etika-akuntabilitas, sampai desain SOP satu halaman yang sengaja dibuat ringkas.",
    image: "/konsep_dasar_manajemen_cinta.webp",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
}

const bookCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
  hover: {
    y: -12,
    transition: {
      duration: 0.3,
    },
  },
}

const overlayVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
}

export default function BooksPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          {/* Page Title */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#f5f1e8] uppercase tracking-wide">Books</h1>
            <motion.div
              className="h-1 bg-gradient-to-r from-[#4a9d6f] to-transparent mt-4 w-32"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>

          {/* Books Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {booksData.map((book) => (
              <motion.div
                key={book.id}
                className="relative group cursor-pointer"
                variants={bookCardVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredId(book.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Book Cover */}
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                  <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />

                  {hoveredId === book.id && (
                    <motion.div
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6"
                      variants={overlayVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div
                        className="text-center space-y-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="text-[#f5f1e8] font-bold text-lg">{book.title}</h3>
                        <p className="text-[#4a9d6f] text-sm font-semibold">{book.author}</p>
                        <p className="text-[#d4d4d4] text-sm leading-relaxed">{book.shortDescription}</p>
                        <Link
                          href={`/books/${book.slug}`}
                          className="inline-block mt-4 px-6 py-2 bg-[#4a9d6f] text-[#1a1a1a] rounded-full font-semibold text-sm hover:bg-[#5ab87f] transition-colors duration-300"
                        >
                          Book Details
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* Book Title */}
                <motion.p
                  className="text-center text-[#d4d4d4] mt-4 font-semibold text-sm line-clamp-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {book.title}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}