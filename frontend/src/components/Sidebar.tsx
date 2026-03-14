"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: "◉" },
  { href: "/datasets", label: "Datasets", icon: "◇" },
  { href: "/finetune", label: "Fine-Tune", icon: "◆" },
  { href: "/jobs", label: "Jobs", icon: "▣" },
  { href: "/models", label: "Models", icon: "⬡" },
  { href: "/chat", label: "Chat", icon: "◈" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-slate-900/80 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.06] px-6">
        <span className="text-xl font-semibold tracking-tight text-white">
          Fine-Tune
        </span>
        <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-300">
          v1
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 p-4">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <span className="text-slate-500">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/[0.06] p-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-xs text-slate-500">
          LoRA · Small models · MVP
        </div>
      </div>
    </aside>
  );
}
