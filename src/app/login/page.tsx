"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    const isValid = /.+@.+\..+/.test(trimmed);
    if (!isValid) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setSubmitting(true);
      setSuccess("");
      const res = await fetch('/api/auth/magic/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, redirectTo: '/dashboard' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send link');
      setSuccess('Check your email for a sign-in link.');
    } catch (err: any) {
      setError(err.message || 'Failed to send link');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--color-porcelain)] min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-[var(--color-ink)]/10">
        <div className="mb-6 text-center">
          <p className="kicker mb-2">Welcome back</p>
          <h1 className="text-serif text-3xl text-[var(--color-accent)] leading-tight">Sign in</h1>
          <p className="text-[var(--color-ink)]/70 mt-2 text-sm">Enter your email to view your dashboard.</p>
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
              placeholder="you@example.com"
              className="w-full bg-white border border-[var(--color-ink)]/15 rounded-xl px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <p className="mt-2 text-xs text-red-600">{error}</p>
            )}
          </div>

          <Button type="submit" variant="primary" disabled={submitting || email.trim().length === 0} className="w-full">
            Continue
          </Button>
        </form>

        {success && (
          <p className="text-center text-xs text-green-700 mt-4">{success}</p>
        )}

        <p className="text-center text-xs text-[var(--color-ink)]/60 mt-6">
          Don’t have an account? Join from the home page.
        </p>
      </div>
    </div>
  );
}


