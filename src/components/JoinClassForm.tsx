"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function JoinClassForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cls, error: classError } = await supabase
      .from("classes")
      .select("id, name")
      .eq("join_code", code.toUpperCase().trim())
      .single();

    if (classError || !cls) {
      setError("Class code not found. Check with your teacher.");
      setLoading(false);
      return;
    }

    const { error: joinError } = await supabase.from("class_members").insert({
      class_id: cls.id,
      student_id: user.id,
    });

    if (joinError) {
      setError(joinError.message.includes("duplicate") ? "You've already joined this class." : joinError.message);
      setLoading(false);
      return;
    }

    setMessage(`Joined ${cls.name}!`);
    setCode("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleJoin} className="rounded-2xl border border-[var(--color-ink)]/10 p-5 space-y-3">
      <h2 className="font-display font-bold">Join a class</h2>
      <p className="text-sm text-[var(--color-ink)]/60">
        Got a code from your teacher? Enter it here so they can see your progress.
      </p>
      <div className="flex gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. AB12CD"
          className="flex-1 rounded-xl border border-[var(--color-ink)]/15 px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] uppercase"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[var(--color-forest)] text-[var(--color-paper)] font-semibold px-5 py-2.5 disabled:opacity-60"
        >
          {loading ? "…" : "Join"}
        </button>
      </div>
      {message && <p className="text-sm text-[var(--color-forest)]">{message}</p>}
      {error && <p className="text-sm text-[var(--color-coral)]">{error}</p>}
    </form>
  );
}
