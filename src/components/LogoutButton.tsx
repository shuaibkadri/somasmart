"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-xl border border-[var(--color-coral)]/30 text-[var(--color-coral)] font-semibold px-6 py-3.5 hover:bg-[var(--color-coral)]/5 transition-colors"
    >
      Log out
    </button>
  );
}
