import AuthSessionProvider from "@/components/auth-session-provider";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}