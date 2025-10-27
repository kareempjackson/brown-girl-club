"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!/.+@.+\..+/.test(trimmedEmail) || password.length < 1) {
      setError("Enter a valid email and password");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      if (data.role === 'cashier') {
        router.replace('/admin/cashier');
      } else {
        router.replace('/admin');
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--color-porcelain)] min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[var(--color-ink)]/10">
        <div className="mb-6 text-center">
          <p className="kicker mb-2">Admin</p>
          <h1 className="text-serif text-3xl text-[var(--color-accent)] leading-tight">Sign in</h1>
          <p className="text-[var(--color-ink)]/70 mt-2 text-sm">Use your admin credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wide text-[var(--color-accent)]/70 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full bg-white border border-[var(--color-ink)]/15 rounded-xl px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wide text-[var(--color-accent)]/70 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-white border border-[var(--color-ink)]/15 rounded-xl px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <Button type="submit" variant="primary" disabled={submitting} className="w-full">
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}


