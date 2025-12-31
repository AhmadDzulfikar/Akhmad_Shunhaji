"use client"

import { motion } from "framer-motion"
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

const socialLinks = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/shunhaji_09/",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@AkhmadShunhaji",
    label: "YouTube",
    color: "#FF0000",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/shunhaji_09/",
    label: "Instagram",
    color: "#E4405F",
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
    },
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
    },
  },
}

export default function ContactPage() {
  const [indonesiaTime, setIndonesiaTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      setIndonesiaTime(now.toLocaleTimeString("id-ID", options))
      setCurrentDate(now.toLocaleDateString("id-ID", dateOptions))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-[#f5f1e8] mb-4 uppercase tracking-wide"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Hubungi Kami
            </motion.h1>
            <motion.p
              className="text-[#a8a8a8] text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Jangan ragu untuk menghubungi kami. Kami siap membantu Anda dengan pertanyaan, 
              undangan, atau kolaborasi yang ingin Anda diskusikan.
            </motion.p>
          </motion.div>

          {/* Indonesia Time Card */}
          <motion.div
            className="mb-12"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-gradient-to-r from-[#4a9d6f]/20 to-[#2d5a3f]/20 border border-[#4a9d6f]/30 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-[#4a9d6f]" />
                <span className="text-[#f5f1e8] font-semibold">Indonesia (WIB - Waktu Indonesia Barat)</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-6 h-6 text-[#4a9d6f]" />
                <span className="text-3xl md:text-4xl font-bold text-[#f5f1e8] font-mono">
                  {indonesiaTime || "--:--:--"}
                </span>
              </div>
              <p className="text-[#a8a8a8] mt-2">{currentDate || "Loading..."}</p>
            </div>
          </motion.div>

          {/* Contact Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* WhatsApp Card */}
            <motion.a
              href="https://wa.me/6285215243740"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#242424] rounded-2xl p-8 border border-[#3a3a3a] hover:border-[#25D366] transition-all duration-300"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#25D366]/20 rounded-full flex items-center justify-center group-hover:bg-[#25D366]/30 transition-colors">
                  <Phone className="w-7 h-7 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#f5f1e8]">WhatsApp</h3>
                  <p className="text-[#a8a8a8] text-sm">Respon cepat via chat</p>
                </div>
              </div>
              <p className="text-[#4a9d6f] font-semibold text-lg group-hover:text-[#25D366] transition-colors">
                +62 852-1524-3740
              </p>
              <p className="text-[#a8a8a8] text-sm mt-2">
                Klik untuk langsung chat di WhatsApp
              </p>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href="mailto:akhmadshunhaji@ptiq.ac.id"
              className="group bg-[#242424] rounded-2xl p-8 border border-[#3a3a3a] hover:border-[#4a9d6f] transition-all duration-300"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#4a9d6f]/20 rounded-full flex items-center justify-center group-hover:bg-[#4a9d6f]/30 transition-colors">
                  <Mail className="w-7 h-7 text-[#4a9d6f]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#f5f1e8]">Email</h3>
                  <p className="text-[#a8a8a8] text-sm">Untuk keperluan formal</p>
                </div>
              </div>
              <p className="text-[#4a9d6f] font-semibold text-lg break-all">
                akhmadshunhaji@ptiq.ac.id
              </p>
              <p className="text-[#a8a8a8] text-sm mt-2">
                Klik untuk mengirim email
              </p>
            </motion.a>
          </motion.div>

          {/* Enquiries Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Speaking & Invitation */}
            <motion.div
              className="bg-[#242424] rounded-2xl p-8 border border-[#3a3a3a]"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-[#f5f1e8] mb-4 italic">
                Undangan & Seminar
              </h3>
              <p className="text-[#a8a8a8] mb-6">
                Untuk undangan mengisi seminar, workshop, atau acara akademik lainnya, 
                silakan hubungi melalui:
              </p>
              <a
                href="mailto:akhmadshunhaji@ptiq.ac.id"
                className="text-[#4a9d6f] hover:text-[#5ab87f] font-semibold transition-colors"
              >
                akhmadshunhaji@ptiq.ac.id
              </a>
            </motion.div>

            {/* Professional Enquiries */}
            <motion.div
              className="bg-[#242424] rounded-2xl p-8 border border-[#3a3a3a]"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-[#f5f1e8] mb-4 italic">
                Kerjasama & Kolaborasi
              </h3>
              <p className="text-[#a8a8a8] mb-6">
                Tertarik untuk berkolaborasi dalam penulisan buku, penelitian, 
                atau proyek pendidikan? Mari berdiskusi:
              </p>
              <a
                href="https://wa.me/6285215243740"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4a9d6f] hover:text-[#5ab87f] font-semibold transition-colors"
              >
                +62 852-1524-3740 (WhatsApp)
              </a>
            </motion.div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl font-bold text-[#f5f1e8] mb-4 italic"
              variants={itemVariants}
            >
              Official Social Media Handles
            </motion.h2>
            <motion.p
              className="text-[#a8a8a8] mb-8"
              variants={itemVariants}
            >
              Ikuti untuk update terbaru tentang buku, artikel, dan kegiatan lainnya
            </motion.p>

            <motion.div
              className="flex justify-center gap-6 flex-wrap"
              variants={containerVariants}
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 p-6 bg-[#242424] rounded-2xl border border-[#3a3a3a] hover:border-[#4a9d6f] transition-all duration-300 min-w-[140px]"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: `${social.color}20` }}
                  >
                    <social.icon
                      className="w-8 h-8 transition-transform group-hover:scale-110"
                      style={{ color: social.color }}
                    />
                  </div>
                  <span className="text-[#f5f1e8] font-semibold">{social.label}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Location Info */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#242424] rounded-2xl p-8 border border-[#3a3a3a] inline-block">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#4a9d6f]" />
                <h3 className="text-xl font-bold text-[#f5f1e8]">Lokasi</h3>
              </div>
              <p className="text-[#a8a8a8]">
                Institut PTIQ Jakarta
              </p>
              <p className="text-[#a8a8a8]">
                Jakarta, Indonesia 🇮🇩
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
