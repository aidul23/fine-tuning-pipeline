"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.06] bg-slate-900/80 px-4 backdrop-blur-xl lg:hidden">
      <span className="font-semibold text-white">Fine-Tune</span>
      <nav className="flex flex-wrap gap-1">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium ${
              pathname === href ? "bg-white/10 text-white" : "text-slate-400"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
