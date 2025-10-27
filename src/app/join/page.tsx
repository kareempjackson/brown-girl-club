"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <JoinClient />
    </Suspense>
  );
}

function JoinClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", planId: "daily-coffee" });
  const [isSubmitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | { subscriptionId: string; planName: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const param = searchParams.get("plan");
    const allowed = new Set(["3-coffees", "daily-coffee", "creator", "unlimited"]);
    if (param && allowed.has(param) && param !== form.planId) {
      setForm((prev) => ({ ...prev, planId: param }));
    }
  }, [searchParams, form.planId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, planId: form.planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to join');
      setSuccess({ subscriptionId: data.subscription.id, planName: data.subscription.planName });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--color-porcelain)] min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="kicker mb-4">Membership</p>
          <h1 className="text-serif text-5xl lg:text-6xl text-[var(--color-accent)] mb-4 leading-tight">Join The Brown Girl Club</h1>
          <p className="text-lg text-[var(--color-ink)]/70">Sign up online. Pay in-store. Your membership is activated at the counter.</p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 lg:p-10 border border-[var(--color-ink)]/10 space-y-6">
            <Input
              label="Full name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Phone (optional)"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">Membership Tier</label>
              <select
                value={form.planId}
                onChange={(e) => setForm({ ...form, planId: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
              >
                <option value="3-coffees">Bronze — 3 Coffees / Week</option>
                <option value="daily-coffee">Silver — Daily Coffee</option>
                <option value="creator">Gold — Creator+ (Bundle & Save)</option>
                <option value="unlimited">Platinum — House 4/day (Bundle & Save)</option>
              </select>
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}

            <Button variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
            <p className="text-sm text-[var(--color-ink)]/60">After submitting, pay at any Brown Girl Café to activate your card.</p>
          </form>
        ) : (
          <div className="bg-white rounded-2xl p-8 lg:p-10 border border-[var(--color-ink)]/10 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h2 className="text-serif text-3xl text-[var(--color-accent)] mb-3">Your membership is almost ready!</h2>
            <p className="text-base text-[var(--color-ink)]/70 mb-6">Pay at Chebauffle House in True Blue or Brown Girl Cafe in Lance Aux Epines to activate your membership.</p>
            <p className="text-sm text-[var(--color-ink)]/60">Show your name or email at checkout. We’ll look you up and activate in seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
