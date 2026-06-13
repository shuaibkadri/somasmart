import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-forest)] text-[var(--color-paper)]">
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-[var(--color-gold)]" />
          <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full border-[30px] border-[var(--color-gold)]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-forest-light)]/40 border border-[var(--color-gold)]/30 px-4 py-1.5 text-sm font-medium mb-8">
            <span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
            Built for Form 4 &amp; Form 6 students
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-[1.1] max-w-3xl">
            Karibu SomaSmart.
            <br />
            <span className="text-[var(--color-gold)]">Soma kwa akili,</span> not just kwa bidii.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-[var(--color-paper)]/80 max-w-xl">
            Practice real NECTA-style questions, see exactly which topics are
            holding you back, and build a daily streak that actually gets you
            ready for exam day.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-[var(--color-gold)] text-[var(--color-ink)] font-semibold px-7 py-3.5 text-base hover:bg-[var(--color-gold-light)] transition-colors"
            >
              Start practicing — it&apos;s free
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-[var(--color-paper)]/30 px-7 py-3.5 text-base font-medium hover:bg-[var(--color-paper)]/10 transition-colors"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-24 w-full">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">
          Three things that make this different
        </h2>
        <div className="mt-12 grid sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-[var(--color-forest)]/10 flex items-center justify-center text-2xl font-display font-bold text-[var(--color-forest)]">
              ✓
            </div>
            <h3 className="mt-4 font-display font-bold text-lg">
              Real exam questions
            </h3>
            <p className="mt-2 text-[var(--color-ink)]/70 text-sm leading-relaxed">
              Past NECTA papers and textbook questions, plus &ldquo;challenge&rdquo;
              questions from other syllabuses to test if you really
              understand the topic.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-[var(--color-coral)]/10 flex items-center justify-center text-2xl font-display font-bold text-[var(--color-coral)]">
              ◐
            </div>
            <h3 className="mt-4 font-display font-bold text-lg">
              See your weak topics
            </h3>
            <p className="mt-2 text-[var(--color-ink)]/70 text-sm leading-relaxed">
              Every answer feeds your personal dashboard — so you know
              exactly where to focus before the exam, not after.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-[var(--color-gold)]/15 flex items-center justify-center text-2xl font-display font-bold text-[var(--color-gold)]">
              🔥
            </div>
            <h3 className="mt-4 font-display font-bold text-lg">
              Streaks that mean something
            </h3>
            <p className="mt-2 text-[var(--color-ink)]/70 text-sm leading-relaxed">
              Earn points for every honest attempt, build a daily streak,
              and watch your weak areas turn strong.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-ink)]/10 py-8 text-center text-sm text-[var(--color-ink)]/50">
        SomaSmart — built in Tanzania, for Tanzanian students.
      </footer>
    </main>
  );
}
