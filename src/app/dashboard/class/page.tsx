import { createClient } from "@/lib/supabase/server";
import CreateClassForm from "@/components/CreateClassForm";

export default async function ClassPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, join_code, class_members(student_id)")
    .eq("teacher_id", user!.id);

  // For each class, get student profiles + their attempt stats
  const classData = await Promise.all(
    (classes ?? []).map(async (c: any) => {
      const studentIds = (c.class_members ?? []).map((m: any) => m.student_id);
      if (studentIds.length === 0) return { ...c, students: [] };

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, xp_total, current_streak")
        .in("id", studentIds);

      const { data: attempts } = await supabase
        .from("attempts")
        .select("user_id, is_correct")
        .in("user_id", studentIds);

      const students = (profiles ?? []).map((p) => {
        const studentAttempts = (attempts ?? []).filter((a) => a.user_id === p.id);
        const correct = studentAttempts.filter((a) => a.is_correct).length;
        const total = studentAttempts.length;
        return {
          ...p,
          totalAttempts: total,
          accuracy: total > 0 ? Math.round((correct / total) * 100) : null,
        };
      });

      return { ...c, students };
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">My class</h1>
        <p className="text-[var(--color-ink)]/60 mt-1">
          Create a class, share the join code with students, and track their progress.
        </p>
      </div>

      <CreateClassForm />

      {classData.map((c: any) => (
        <div key={c.id} className="rounded-2xl border border-[var(--color-ink)]/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">{c.name}</h2>
            <span className="text-sm font-mono bg-[var(--color-gold)]/15 px-3 py-1 rounded-full">
              Code: {c.join_code}
            </span>
          </div>

          {c.students.length === 0 ? (
            <p className="text-sm text-[var(--color-ink)]/60">
              No students have joined yet. Share the code above.
            </p>
          ) : (
            <div className="space-y-2">
              {c.students.map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-sm py-2 border-b border-[var(--color-ink)]/5 last:border-0"
                >
                  <span className="font-medium">{s.name}</span>
                  <div className="flex gap-4 text-[var(--color-ink)]/60">
                    <span>{s.xp_total} XP</span>
                    <span>🔥 {s.current_streak}</span>
                    <span>
                      {s.accuracy !== null ? `${s.accuracy}% accuracy` : "No attempts yet"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
