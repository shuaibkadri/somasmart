import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  // Fetch attempts joined with subtopic/topic/subject info for weak-area calc
  const { data: attempts } = await supabase
    .from("attempts")
    .select(
      `is_correct, question:questions(tier, subtopic:subtopics(name, topic:topics(name, subject:subjects(name))))`
    )
    .eq("user_id", user!.id);

  // Aggregate accuracy per subtopic
  type Agg = { name: string; correct: number; total: number };
  const bySubtopic: Record<string, Agg> = {};

  (attempts ?? []).forEach((a: any) => {
    const subtopicName = a.question?.subtopic?.name;
    if (!subtopicName) return;
    if (!bySubtopic[subtopicName]) {
      bySubtopic[subtopicName] = { name: subtopicName, correct: 0, total: 0 };
    }
    bySubtopic[subtopicName].total += 1;
    if (a.is_correct) bySubtopic[subtopicName].correct += 1;
  });

  const subtopicStats = Object.values(bySubtopic)
    .map((s) => ({ ...s, accuracy: Math.round((s.correct / s.total) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakest = subtopicStats.slice(0, 3);
  const totalAttempts = attempts?.length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Habari, {profile?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-[var(--color-ink)]/60 mt-1">
          {totalAttempts === 0
            ? "Let's get your first practice session started."
            : `You've answered ${totalAttempts} question${totalAttempts === 1 ? "" : "s"} so far.`}
        </p>
      </div>

      <Link
        href="/dashboard/practice"
        className="block rounded-2xl bg-[var(--color-forest)] text-[var(--color-paper)] p-6 hover:bg-[var(--color-forest-light)] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-bold">Start practicing</p>
            <p className="text-[var(--color-paper)]/70 text-sm mt-1">
              Questions picked for you, weighted to your weak spots
            </p>
          </div>
          <span className="text-3xl">→</span>
        </div>
      </Link>

      <div>
        <h2 className="font-display font-bold text-lg mb-3">
          {totalAttempts === 0 ? "Your topics" : "Areas to focus on"}
        </h2>

        {totalAttempts === 0 ? (
          <div className="rounded-2xl border border-[var(--color-ink)]/10 p-6 text-center text-[var(--color-ink)]/60">
            <p>Once you start practicing, your weak topics will show up here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weakest.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-[var(--color-ink)]/10 p-4"
              >
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>{s.name}</span>
                  <span
                    className={
                      s.accuracy < 50
                        ? "text-[var(--color-coral)]"
                        : "text-[var(--color-forest)]"
                    }
                  >
                    {s.accuracy}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-ink)]/8 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.accuracy < 50
                        ? "bg-[var(--color-coral)]"
                        : "bg-[var(--color-forest)]"
                    }`}
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--color-ink)]/50 mt-1.5">
                  {s.correct} / {s.total} correct
                </p>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/dashboard/progress"
          className="mt-4 inline-block text-sm font-medium text-[var(--color-forest)]"
        >
          View full progress →
        </Link>
      </div>
    </div>
  );
}
