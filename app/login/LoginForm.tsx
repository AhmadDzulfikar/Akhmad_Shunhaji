// app/login/LoginForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  callbackUrl: string;
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErr(null);

    const res = await signIn("credentials", {
      redirect: false,
      email: email.trim(),
      password: password.trim(),
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setErr("Email atau password salah");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-[#262727] p-6 rounded-lg border border-[#3a3a3a]"
      >
        <h1 className="text-[#f5f1e8] text-2xl font-bold mb-4">Admin Login</h1>
        {err && <p className="text-red-400 mb-3">{err}</p>}

        <input
          className="w-full mb-3 p-3 rounded bg-[#1a1a1a] text-[#f5f1e8]"
          type="email"
          placeholder="Email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 rounded bg-[#1a1a1a] text-[#f5f1e8]"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full py-3 bg-[#4a9d6f] text-[#1a1a1a] font-bold rounded disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
