import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  ListTodo,
  Boxes,
  MessageCircle,
} from "lucide-react";

export const navItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/datasets", label: "Datasets", Icon: Database },
  { href: "/finetune", label: "Fine-Tune", Icon: Sparkles },
  { href: "/jobs", label: "Jobs", Icon: ListTodo },
  { href: "/models", label: "Models", Icon: Boxes },
  { href: "/chat", label: "Chat", Icon: MessageCircle },
];

export function getPageIcon(path: string): LucideIcon {
  const item = navItems.find((n) => n.href === path);
  return item ? item.Icon : LayoutDashboard;
}
