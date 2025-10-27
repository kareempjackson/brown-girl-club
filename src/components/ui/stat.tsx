interface StatProps {
  label: string;
  value: string | number;
}

export function Stat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-ink/60 uppercase tracking-wide">{label}</p>
      <p className="text-serif text-4xl text-accent font-normal">{value}</p>
    </div>
  );
}

