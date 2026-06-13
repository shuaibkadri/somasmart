"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLevel, setFormLevel] = useState("Form 4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, form_level: formLevel },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-sm w-full text-center">
          <div className="text-4xl mb-4">📩</div>
          <h1 className="font-display text-2xl font-bold">Check your email</h1>
          <p className="mt-3 text-[var(--color-ink)]/70">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then log in.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-[var(--color-forest)] text-[var(--color-paper)] font-semibold px-6 py-3"
          >
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-sm w-full">
        <h1 className="font-display text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-[var(--color-ink)]/60 text-sm">
          Free to join. Start practicing in under a minute.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-ink)]/15 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
              placeholder="Asha Juma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="form_level">
              Form level
            </label>
            <select
              id="form_level"
              value={formLevel}
              onChange={(e) => setFormLevel(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-ink)]/15 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
            >
              <option>Form 1</option>
              <option>Form 2</option>
              <option>Form 3</option>
              <option>Form 4</option>
              <option>Form 5</option>
              <option>Form 6</option>
            </select>
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-ink)]/15 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
              placeholder="At least 6 characters"
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-ink)]/60">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-forest)] font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
