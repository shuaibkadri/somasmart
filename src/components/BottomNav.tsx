"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const studentLinks = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard/practice", label: "Practice", icon: "✏️" },
  { href: "/dashboard/progress", label: "Progress", icon: "📊" },
  { href: "/dashboard/account", label: "Account", icon: "👤" },
];

const teacherLinks = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/dashboard/class", label: "My Class", icon: "🏫" },
  { href: "/dashboard/account", label: "Account", icon: "👤" },
];

export default function BottomNav({ role }: { role: string }) {
  const pathname = usePathname();
  const links = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 sm:hidden bg-white border-t border-[var(--color-ink)]/10">
      <div className="max-w-3xl mx-auto grid grid-cols-4 sm:grid-cols-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                active
                  ? "text-[var(--color-forest)]"
                  : "text-[var(--color-ink)]/50"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
