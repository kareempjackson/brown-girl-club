import { ReactNode } from "react";

type AlertTone = "ok" | "warn" | "error";

interface AlertProps {
  tone?: AlertTone;
  children: ReactNode;
}

export function Alert({ tone = "ok", children }: AlertProps) {
  const tones = {
    ok: "bg-green-50 border-green-200 text-green-900",
    warn: "bg-amber-50 border-amber-200 text-amber-900",
    error: "bg-red-50 border-red-200 text-red-900"
  };
  
  return (
    <div 
      className={`px-4 py-3 rounded-[var(--radius-md)] border ${tones[tone]}`}
      role="alert"
    >
      <p className="text-sm">{children}</p>
    </div>
  );
}

