"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Question = {
  id: string;
  question_text: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string | null;
  tier: "core" | "challenge";
  source_syllabus: string;
  subtopic: { id: string; name: string; topic: { id: string; name: string } };
};

export default function PracticeSession({
  subjectName,
  questions,
}: {
  subjectName: string;
  questions: Question[];
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const router = useRouter();

  const question = questions[index];
  const isCorrect = selected === question?.correct_answer;

  const handleSelect = (key: string) => {
    if (submitted) return;
    setSelected(key);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitted(true);

    const correct = selected === question.correct_answer;
    const points = correct ? 10 : 2; // points for attempting + bonus for correct
    setSessionXp((xp) => xp + points);
    if (correct) setSessionCorrect((c) => c + 1);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("attempts").insert({
      user_id: user.id,
      question_id: question.id,
      selected_answer: selected,
      is_correct: correct,
      points_awarded: points,
    });

    // Update profile XP + streak
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp_total, current_streak, longest_streak, last_practice_date")
      .eq("id", user.id)
      .single();

    if (profile) {
      const today = new Date().toISOString().split("T")[0];
      let newStreak = profile.current_streak;
      if (profile.last_practice_date !== today) {
        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];
        newStreak =
          profile.last_practice_date === yesterday
            ? profile.current_streak + 1
            : 1;
      }

      await supabase
        .from("profiles")
        .update({
          xp_total: profile.xp_total + points,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, profile.longest_streak),
          last_practice_date: today,
        })
        .eq("id", user.id);

      router.refresh();
    }
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
  };

  if (finished) {
    return (
      <div className="rounded-2xl border border-[var(--color-ink)]/10 p-8 text-center space-y-4">
        <div className="text-4xl">🎉</div>
        <h2 className="font-display text-2xl font-bold">Session complete!</h2>
        <p className="text-[var(--color-ink)]/70">
          You got {sessionCorrect} / {questions.length} correct and earned{" "}
          <span className="font-semibold text-[var(--color-forest)]">
            {sessionXp} XP
          </span>
          .
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/dashboard/practice"
            className="rounded-xl bg-[var(--color-forest)] text-[var(--color-paper)] font-semibold px-6 py-3"
          >
            Practice another subject
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-[var(--color-ink)]/15 font-medium px-6 py-3"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress + tags */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-ink)]/50">
          {subjectName} · {question.subtopic.topic.name} · {question.subtopic.name}
        </span>
        <span className="text-[var(--color-ink)]/50">
          {index + 1} / {questions.length}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-[var(--color-ink)]/8 overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--color-gold)] transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Tier badge */}
      <span
        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
          question.tier === "challenge"
            ? "bg-[var(--color-coral)]/10 text-[var(--color-coral)]"
            : "bg-[var(--color-forest)]/10 text-[var(--color-forest)]"
        }`}
      >
        {question.tier === "challenge" ? "Challenge" : "Core"} · {question.source_syllabus}
      </span>

      {/* Question */}
      <h2 className="font-display text-lg font-bold leading-snug">
        {question.question_text}
      </h2>

      {/* Options */}
      <div className="space-y-2.5">
        {Object.entries(question.options).map(([key, text]) => {
          let style =
            "border-[var(--color-ink)]/12 bg-white hover:border-[var(--color-forest)]/40";

          if (submitted) {
            if (key === question.correct_answer) {
              style = "border-[var(--color-forest)] bg-[var(--color-forest)]/8";
            } else if (key === selected) {
              style = "border-[var(--color-coral)] bg-[var(--color-coral)]/8";
            } else {
              style = "border-[var(--color-ink)]/8 bg-white opacity-60";
            }
          } else if (key === selected) {
            style = "border-[var(--color-forest)] bg-[var(--color-forest)]/5";
          }

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={submitted}
              className={`w-full text-left rounded-xl border-2 px-4 py-3.5 transition-colors flex gap-3 ${style}`}
            >
              <span className="font-semibold">{key}.</span>
              <span>{text}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div
          className={`rounded-xl p-4 text-sm ${
            isCorrect
              ? "bg-[var(--color-forest)]/8 text-[var(--color-forest)]"
              : "bg-[var(--color-coral)]/8 text-[var(--color-coral)]"
          }`}
        >
          <p className="font-semibold">
            {isCorrect ? "Correct! +10 XP" : `Not quite — the answer was ${question.correct_answer}. +2 XP for trying.`}
          </p>
          {question.explanation && (
            <p className="mt-1.5 text-[var(--color-ink)]/70">{question.explanation}</p>
          )}
        </div>
      )}

      {/* Action button */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full rounded-xl bg-[var(--color-forest)] text-[var(--color-paper)] font-semibold px-6 py-3.5 disabled:opacity-40 hover:bg-[var(--color-forest-light)] transition-colors"
        >
          Check answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-[var(--color-gold)] text-[var(--color-ink)] font-semibold px-6 py-3.5 hover:bg-[var(--color-gold-light)] transition-colors"
        >
          {index + 1 >= questions.length ? "Finish session" : "Next question"}
        </button>
      )}
    </div>
  );
}
