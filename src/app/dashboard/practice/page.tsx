import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PracticeHome() {
  const supabase = await createClient();
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Practice</h1>
        <p className="text-[var(--color-ink)]/60 mt-1">
          Pick a subject to start a practice session.
        </p>
      </div>

      {(!subjects || subjects.length === 0) && (
        <div className="rounded-2xl border border-[var(--color-ink)]/10 p-6 text-center text-[var(--color-ink)]/60">
          No subjects yet — check back soon.
        </div>
      )}

      <div className="space-y-3">
        {subjects?.map((subject) => (
          <Link
            key={subject.id}
            href={`/dashboard/practice/${subject.id}`}
            className="flex items-center justify-between rounded-2xl border border-[var(--color-ink)]/10 p-5 hover:border-[var(--color-forest)]/40 hover:bg-[var(--color-forest)]/[0.03] transition-colors"
          >
            <span className="font-display font-bold text-lg">
              {subject.name}
            </span>
            <span className="text-[var(--color-forest)] text-xl">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
