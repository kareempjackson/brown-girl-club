import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  
  return (
    <div className="w-full">
      <label 
        htmlFor={inputId}
        className="block text-xs font-bold text-[var(--color-accent)] mb-3 uppercase tracking-wider"
      >
        {label}
      </label>
      <input
        id={inputId}
        className="w-full px-5 py-4 min-h-[52px] bg-white border border-[var(--color-ink)]/15 rounded-xl text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

