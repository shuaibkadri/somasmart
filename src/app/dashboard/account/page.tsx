import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import JoinClassForm from "@/components/JoinClassForm";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Account</h1>

      <div className="rounded-2xl border border-[var(--color-ink)]/10 p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-ink)]/60">Name</span>
          <span className="font-medium">{profile?.name ?? "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-ink)]/60">Email</span>
          <span className="font-medium">{user?.email}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-ink)]/60">Form level</span>
          <span className="font-medium">{profile?.form_level ?? "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-ink)]/60">Plan</span>
          <span className="font-medium capitalize">{profile?.subscription_status ?? "free"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-ink)]/60">Total XP</span>
          <span className="font-medium">{profile?.xp_total ?? 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-ink)]/60">Longest streak</span>
          <span className="font-medium">{profile?.longest_streak ?? 0} days</span>
        </div>
      </div>

      <LogoutButton />

      {profile?.role === "student" && <JoinClassForm />}
    </div>
  );
}
