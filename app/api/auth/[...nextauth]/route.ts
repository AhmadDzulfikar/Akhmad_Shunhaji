import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs"; // pastikan tidak running di Edge



const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase() || "";
        const password = credentials?.password || "";

        // --- BLOK DEBUG YANG SUDAH DIPERBAIKI ---
        console.log("--- DEBUG ENV START ---");
        const rawEnvVar = process.env.ADMIN_PASSWORD_HASH;
        console.log(
          "[DEBUG] Nilai mentah (process.env.ADMIN_PASSWORD_HASH):",
          rawEnvVar
        );
        console.log("[DEBUG] Tipe data rawEnvVar:", typeof rawEnvVar);
        console.log("[DEBUG] Panjang rawEnvVar:", rawEnvVar?.length);

        const hash = (rawEnvVar || "").trim(); // <-- Deklarasi 'hash'
        console.log("[DEBUG] Nilai setelah trim() (variabel 'hash'):", hash);
        console.log("[DEBUG] Tipe data 'hash':", typeof hash);
        console.log("[DEBUG] Panjang 'hash':", hash.length); // INI YANG PENTING

        const adminEmail = (process.env.ADMIN_EMAIL || "") // <-- Deklarasi 'adminEmail'
          .trim()
          .toLowerCase();
        console.log("[AUTH] input email:", email);
        console.log("[AUTH] adminEmail:", adminEmail);
        console.log("--- DEBUG ENV END ---");
        // --------------------------------------

        if (!email || !password || !adminEmail || !hash) return null;
        if (email !== adminEmail) return null;

        let ok = false;
        try {
          ok = await bcrypt.compare(password, hash);
        } catch (e) {
          console.error("[AUTH] bcrypt error:", e);
          ok = false;
        }

        console.log("[AUTH] compare result:", ok); // DEBUG

        if (!ok) return null;
        return { id: "admin", name: "Admin", email: adminEmail };
      },
    }),
  ],
  session: { strategy: "jwt" },
});


export { handler as GET, handler as POST };
