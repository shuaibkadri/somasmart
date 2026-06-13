"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-sm w-full">
        <h1 className="font-display text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-[var(--color-ink)]/60 text-sm">
          Log in to keep your streak going.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-ink)]/15 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-ink)]/15 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
              placeholder="Your password"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-coral)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--color-forest)] text-[var(--color-paper)] font-semibold px-6 py-3.5 hover:bg-[var(--color-forest-light)] transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-ink)]/60">
          New here?{" "}
          <Link href="/signup" className="text-[var(--color-forest)] font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
