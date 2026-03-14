import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl p-6 ${hover ? "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
