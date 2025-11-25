// export { default } from "next-auth/middleware";

// // Jaga hanya rute admin (form tambah & API admin)
// // BUKAN /api/posts publik
// export const config = {
//   matcher: ["/blog/new", "/api/admin/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  // kalau belum login, lempar ke halaman login
  if (!token) {
    const loginUrl = new URL("/login", req.url); // sesuaikan route login kamu
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/new", "/api/admin/:path*"],
};
