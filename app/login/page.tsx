// app/login/page.tsx
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic"; // jangan di-SSG, selalu render dinamis

type SearchParams = {
  callbackUrl?: string | string[];
};

type LoginPageProps = {
  searchParams?: Promise<SearchParams>;
};

function normalizeCallbackUrl(callbackParam: string | string[] | undefined) {
  const callbackUrl = Array.isArray(callbackParam)
    ? callbackParam[0]
    : callbackParam;

  if (
    !callbackUrl ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return "/blog";
  }

  return callbackUrl;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackUrl = normalizeCallbackUrl(
    resolvedSearchParams?.callbackUrl,
  );

  return <LoginForm callbackUrl={callbackUrl} />;
}
