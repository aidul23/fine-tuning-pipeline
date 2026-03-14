"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/datasets", label: "Datasets" },
  { href: "/finetune", label: "Fine-Tune" },
  { href: "/jobs", label: "Jobs" },
  { href: "/models", label: "Models" },
  { href: "/chat", label: "Chat" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.06] bg-slate-900/80 px-4 backdrop-blur-xl lg:hidden">
      <span className="font-semibold text-white">Fine-Tune</span>
      <nav className="flex flex-wrap gap-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-2 py-1.5 text-xs font-medium ${
              pathname === item.href ? "bg-white/10 text-white" : "text-slate-400"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
