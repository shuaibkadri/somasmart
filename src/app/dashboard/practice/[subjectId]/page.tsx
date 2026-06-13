import { createClient } from "@/lib/supabase/server";
import PracticeSession from "@/components/PracticeSession";
import Link from "next/link";

export default async function SubjectPracticePage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const supabase = await createClient();

  const { data: subject } = await supabase
    .from("subjects")
    .select("id, name")
    .eq("id", subjectId)
    .single();

  // Fetch MCQ questions for this subject via topics/subtopics
  const { data: questions } = await supabase
    .from("questions")
    .select(
      `id, question_text, options, correct_answer, explanation, tier, source_syllabus,
       subtopic:subtopics!inner(id, name, topic:topics!inner(id, name, subject_id))`
    )
    .eq("question_type", "mcq")
    .eq("subtopic.topic.subject_id", subjectId)
    .limit(20);

  if (!questions || questions.length === 0) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/practice" className="text-sm text-[var(--color-forest)]">
          ← Back to subjects
        </Link>
        <div className="rounded-2xl border border-[var(--color-ink)]/10 p-6 text-center text-[var(--color-ink)]/60">
          No questions for {subject?.name} yet — check back soon.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/dashboard/practice" className="text-sm text-[var(--color-forest)]">
        ← Back to subjects
      </Link>
      <PracticeSession subjectName={subject?.name ?? ""} questions={questions as any} />
    </div>
  );
}
