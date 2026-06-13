"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function CreateClassForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("classes").insert({
      teacher_id: user.id,
      name,
      join_code: randomCode(),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setName("");
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleCreate} className="rounded-2xl border border-[var(--color-ink)]/10 p-5 flex gap-3">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Class name, e.g. Form 4 Physics"
        className="flex-1 rounded-xl border border-[var(--color-ink)]/15 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[var(--color-forest)] text-[var(--color-paper)] font-semibold px-5 py-2.5 disabled:opacity-60"
      >
        {loading ? "…" : "Create"}
      </button>
      {error && <p className="text-sm text-[var(--color-coral)]">{error}</p>}
    </form>
  );
}
