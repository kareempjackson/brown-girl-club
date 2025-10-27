"use client";

import { motion } from "framer-motion";
import { Button } from "./button";
import Link from "next/link";

interface PlanCardProps {
  name: string;
  price: string;
  perks: string[];
  featured?: boolean;
}

export function PlanCard({ name, price, perks, featured = false }: PlanCardProps) {
  return (
    <motion.div
      className={`${featured ? 'bg-[var(--color-porcelain)] border-2 border-[var(--color-accent)]/20' : 'bg-white border border-[var(--color-accent)]/10'} rounded-2xl p-8 shadow-sm relative`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[var(--color-accent)] text-white text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wide">
            Popular
          </span>
        </div>
      )}
      
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--color-accent)]/70 font-bold mb-3">{name}</p>
          <p className="text-serif text-5xl text-[var(--color-accent)]">{price}</p>
        </div>
        
        <hr className="rule-thin" />
        
        <ul className="space-y-4">
          {perks.map((perk, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-1.5 flex-shrink-0" />
              <span className="text-base text-[var(--color-ink)]/80 leading-relaxed">{perk}</span>
            </li>
          ))}
        </ul>
        
        <Link href={`/join?plan=${encodeURIComponent(slugFromName(name))}`} className="block">
          <Button 
            variant={featured ? "primary" : "secondary"} 
            className="w-full"
          >
            Select Plan
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function slugFromName(name: string): string {
  const map: Record<string, string> = {
    "3 coffees / week": "3-coffees",
    "Daily coffee": "daily-coffee",
    "Creator+": "creator",
    "House Unlimited": "unlimited",
  };
  return map[name] || name.toLowerCase().replace(/\s+/g, '-');
}

