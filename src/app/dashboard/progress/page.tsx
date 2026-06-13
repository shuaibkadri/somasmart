import { createClient } from "@/lib/supabase/server";

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: attempts } = await supabase
    .from("attempts")
    .select(
      `is_correct, question:questions(tier, subtopic:subtopics(name, topic:topics(name, subject:subjects(name))))`
    )
    .eq("user_id", user!.id);

  type Agg = { name: string; correct: number; total: number; coreCorrect: number; coreTotal: number; challengeCorrect: number; challengeTotal: number };
  const bySubject: Record<string, Record<string, Agg>> = {};

  (attempts ?? []).forEach((a: any) => {
    const subjectName = a.question?.subtopic?.topic?.subject?.name;
    const subtopicName = a.question?.subtopic?.name;
    const tier = a.question?.tier;
    if (!subjectName || !subtopicName) return;

    bySubject[subjectName] = bySubject[subjectName] || {};
    if (!bySubject[subjectName][subtopicName]) {
      bySubject[subjectName][subtopicName] = {
        name: subtopicName,
        correct: 0,
        total: 0,
        coreCorrect: 0,
        coreTotal: 0,
        challengeCorrect: 0,
        challengeTotal: 0,
      };
    }
    const agg = bySubject[subjectName][subtopicName];
    agg.total += 1;
    if (a.is_correct) agg.correct += 1;
    if (tier === "core") {
      agg.coreTotal += 1;
      if (a.is_correct) agg.coreCorrect += 1;
    } else {
      agg.challengeTotal += 1;
      if (a.is_correct) agg.challengeCorrect += 1;
    }
  });

  const subjects = Object.entries(bySubject);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Your progress</h1>
        <p className="text-[var(--color-ink)]/60 mt-1">
          Accuracy by topic, split into core (NECTA-style) and challenge questions.
        </p>
      </div>

      {subjects.length === 0 && (
        <div className="rounded-2xl border border-[var(--color-ink)]/10 p-6 text-center text-[var(--color-ink)]/60">
          No data yet — complete a practice session to see your breakdown here.
        </div>
      )}

      {subjects.map(([subjectName, subtopics]) => (
        <div key={subjectName}>
          <h2 className="font-display font-bold text-lg mb-3">{subjectName}</h2>
          <div className="space-y-3">
            {Object.values(subtopics).map((s) => {
              const accuracy = Math.round((s.correct / s.total) * 100);
              const coreAcc = s.coreTotal ? Math.round((s.coreCorrect / s.coreTotal) * 100) : null;
              const challengeAcc = s.challengeTotal ? Math.round((s.challengeCorrect / s.challengeTotal) * 100) : null;

              return (
                <div key={s.name} className="rounded-2xl border border-[var(--color-ink)]/10 p-4">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>{s.name}</span>
                    <span className={accuracy < 50 ? "text-[var(--color-coral)]" : "text-[var(--color-forest)]"}>
                      {accuracy}% overall
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-ink)]/8 overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${accuracy < 50 ? "bg-[var(--color-coral)]" : "bg-[var(--color-forest)]"}`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-[var(--color-ink)]/60">
                    <span>Core: {coreAcc !== null ? `${coreAcc}% (${s.coreCorrect}/${s.coreTotal})` : "—"}</span>
                    <span>Challenge: {challengeAcc !== null ? `${challengeAcc}% (${s.challengeCorrect}/${s.challengeTotal})` : "—"}</span>
                  </div>
                  {coreAcc !== null && challengeAcc !== null && coreAcc - challengeAcc >= 25 && (
                    <p className="mt-2 text-xs text-[var(--color-gold)] bg-[var(--color-gold)]/10 rounded-lg px-2.5 py-1.5 inline-block">
                      You know the NECTA pattern here, but struggle when the question is framed differently — worth digging into the concept itself.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
