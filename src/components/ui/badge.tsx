import { ReactNode } from "react";

type BadgeTone = "ink" | "oat" | "espresso";

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = "ink", children }: BadgeProps) {
  const tones = {
    ink: "bg-[var(--color-ink)]/8 text-[var(--color-ink)] border border-[var(--color-ink)]/10",
    oat: "bg-[var(--color-oat)]/30 text-[var(--color-accent)] border border-[var(--color-oat)]/40",
    espresso: "bg-[var(--color-accent)] text-white border border-[var(--color-accent)]"
  };
  
  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

