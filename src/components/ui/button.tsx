"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ 
  variant = "primary", 
  children, 
  className = "",
  ...props 
}: ButtonProps) {
  const baseStyles = "font-sans inline-flex items-center justify-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider text-xs sm:text-sm font-bold";
  
  const variants = {
    primary: "bg-[var(--color-accent)] text-white px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-full hover:bg-[var(--color-accent)]/90 active:scale-95",
    secondary: "bg-[var(--color-porcelain)] text-[var(--color-accent)] px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-full hover:bg-[var(--color-oat)]/40 border border-[var(--color-accent)]/10 active:scale-95",
    ghost: "bg-transparent text-[var(--color-accent)] px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3 rounded-full hover:bg-[var(--color-surface)] active:scale-95",
    link: "bg-transparent text-[var(--color-accent)] p-0 link-underline hover:opacity-70 normal-case tracking-normal min-h-auto min-w-auto"
  };
  
  // Disable animations on mobile for better performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  
  const hoverAnimation = variant !== "link" && !isMobile ? {
    y: -2,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  } : {};
  
  const tapAnimation = variant !== "link" && !isMobile ? {
    y: 0,
    transition: { duration: 0.15 }
  } : {};

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      {...props}
    >
      {children}
    </motion.button>
  );
}

