import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = creds?.email?.toString().trim().toLowerCase() || "";
        const password = creds?.password || "";

        const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
        const hash = (process.env.ADMIN_PASSWORD_HASH || "").trim();

        if (!email || !password || !adminEmail || !hash) return null;
        if (email !== adminEmail) return null;

        const ok = await bcrypt.compare(password, hash);
        if (!ok) return null;

        return { id: "admin", name: "Admin", email: adminEmail };
      },
    }),
  ],
};
