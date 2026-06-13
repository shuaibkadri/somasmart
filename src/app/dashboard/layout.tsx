import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex-1 flex flex-col pb-20">
      <header className="sticky top-0 z-10 bg-[var(--color-paper)]/95 backdrop-blur border-b border-[var(--color-ink)]/8">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="font-display font-bold text-lg text-[var(--color-forest)]">
            SomaSmart
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-gold)]/15 px-3 py-1 font-semibold text-[var(--color-ink)]">
              🔥 {profile?.current_streak ?? 0}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-forest)]/10 px-3 py-1 font-semibold text-[var(--color-forest)]">
              {profile?.xp_total ?? 0} XP
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-5 py-6">
        {children}
      </div>

      <BottomNav role={profile?.role ?? "student"} />
    </div>
  );
}
