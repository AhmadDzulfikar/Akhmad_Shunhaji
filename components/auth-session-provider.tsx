"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider({
  children,
}: { children: React.ReactNode }) {
  // Bisa tambahkan props: <SessionProvider basePath="/api/auth"> kalau perlu
  return <SessionProvider>{children}</SessionProvider>;
}
