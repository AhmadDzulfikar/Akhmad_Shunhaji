// app/login/page.tsx
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic"; // jangan di-SSG, selalu render dinamis

type SearchParams = {
  callbackUrl?: string | string[];
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const callbackParam = searchParams?.callbackUrl;
  const callbackUrl =
    Array.isArray(callbackParam) ? callbackParam[0] : callbackParam || "/blog";

  return <LoginForm callbackUrl={callbackUrl} />;
}