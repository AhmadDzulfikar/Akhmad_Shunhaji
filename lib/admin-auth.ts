import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const userEmail = (session?.user?.email || "").trim().toLowerCase();

  if (!session || !userEmail || !adminEmail || userEmail !== adminEmail) {
    return null;
  }

  return session;
}
