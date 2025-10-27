import { ReactNode } from "react";

interface CardProps {
  title?: string;
  surface?: boolean;
  children: ReactNode;
  className?: string;
}

export function Card({ title, surface = false, children, className = "" }: CardProps) {
  return (
    <div className={`${surface ? 'card-surface' : 'card'} ${className}`}>
      {title && (
        <>
          <h3 className="text-xl font-bold text-accent mb-4">{title}</h3>
          <hr className="rule-thin mb-4" />
        </>
      )}
      {children}
    </div>
  );
}

