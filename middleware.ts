export { default } from "next-auth/middleware";

// Jaga hanya rute admin (form tambah & API admin)
// BUKAN /api/posts publik
export const config = {
  matcher: ["/blog/new", "/api/admin/:path*"],
};