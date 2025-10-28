"use client";

import { useEffect, useMemo, useState } from "react";

type PlanId = "3-coffees" | "daily-coffee" | "creator" | "unlimited";
type ItemType = 'coffee' | 'food' | 'dessert';

interface Subscriber {
  id: string; // subscription id
  userId: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanId;
  planName: string;
  status: "active" | "unpaid" | "paused" | "cancelled";
}

interface PublicProfile {
  user: { id: string; name: string; memberSince: string };
  subscription: {
    id: string;
    planId: PlanId;
    planName: string;
    status: "active" | "pending_payment" | "paused" | "cancelled";
    currentPeriodStart: string;
    currentPeriodEnd: string;
    createdAt: string;
  } | null;
  limits: { remainingCoffees?: number | null; remainingFood?: number | null; unlimited?: boolean };
  usage: {
    today: { coffees: number; food: number; desserts: number; total: number };
    recent: Array<{ id: string; itemType: ItemType; itemName: string; redeemedAt: string; location?: string }>;
  };
}

export default function CashierPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastSubscriptionId, setLastSubscriptionId] = useState<string | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [itemType, setItemType] = useState<ItemType>('coffee');
  const [itemName, setItemName] = useState('Coffee');
  const [location, setLocation] = useState('Lance Aux Epines');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/subscribers', { cache: 'no-store', credentials: 'same-origin' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load subscribers');
        setSubscribers(data.subscribers || []);
      } catch (e) {
        setSubscribers([]);
      }
    })();
  }, []);

  const [dynamicMatch, setDynamicMatch] = useState<Subscriber | null>(null);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as Subscriber[];
    const base = (subscribers || []).filter(
      s => s.email.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).slice(0, 8);
    if (dynamicMatch && (dynamicMatch.email.toLowerCase().includes(q))) {
      // put dynamic email first if not already in list
      const exists = base.some(s => s.email.toLowerCase() === dynamicMatch.email.toLowerCase());
      return exists ? base : [dynamicMatch, ...base];
    }
    return base;
  }, [query, subscribers, dynamicMatch]);

  const selected = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null as Subscriber | null;
    return (subscribers || []).find(s => s.email.toLowerCase() === q) || null;
  }, [query, subscribers]);

  // Live lookup by email if not in subscribers
  useEffect(() => {
    const q = query.trim();
    if (!q || !q.includes('@')) { setDynamicMatch(null); return; }
    const inList = (subscribers || []).some(s => s.email.toLowerCase() === q.toLowerCase());
    if (inList) { setDynamicMatch(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/validate?email=${encodeURIComponent(q)}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) { setDynamicMatch(null); return; }
        const sub: Subscriber = {
          id: data.subscription.id,
          userId: data.subscription.userId,
          name: data.subscription.planName,
          email: q,
          phone: '',
          plan: 'daily-coffee',
          planName: data.subscription.planName,
          status: (data.subscription.status === 'pending_payment' ? 'unpaid' : data.subscription.status) as any,
        };
        if (!cancelled) setDynamicMatch(sub);
      } catch {
        if (!cancelled) setDynamicMatch(null);
      }
    })();
    return () => { cancelled = true; };
  }, [query, subscribers]);

  // Load selected user's profile
  useEffect(() => {
    (async () => {
      try {
        setProfile(null);
        if (!selected?.userId) return;
        setProfileLoading(true);
        const res = await fetch(`/api/public/profile?userId=${encodeURIComponent(selected.userId)}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');
        setProfile(data as PublicProfile);
      } catch (_e) {
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [selected?.userId]);

  async function markPaid() {
    try {
      setLoading(true);
      setMessage(null);
      const match = selected || matches[0];
      if (!match) throw new Error('Select a user');
      const subId = match.id; // use existing subscription id
      setLastSubscriptionId(subId);

      const resStatus = await fetch('/api/membership/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subId, status: 'paid' }),
      });
      const statusData = await resStatus.json();
      if (!resStatus.ok) throw new Error(statusData.error || 'Activation failed');
      setMessage('Marked as paid and activated.');
    } catch (e: any) {
      setMessage(e.message || 'Failed to mark as paid');
    } finally {
      setLoading(false);
    }
  }

  async function recordRedemption() {
    try {
      setLoading(true);
      setMessage(null);
      setNotice(null);
      const match = selected || matches[0];
      if (!match) throw new Error('Select a user');
      if (!itemName) throw new Error('Enter item name');
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: match.userId,
          itemType,
          itemName,
          location: location || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to record redemption');
      setMessage('Redemption recorded and receipt emailed.');
      if (data.needsNotice) {
        setNotice('Heads up: more than 5 coffees redeemed today. Please notify a manager.');
      }
      // refresh profile to show updated limits/usage
      if (match.userId) {
        try {
          setProfileLoading(true);
          const res2 = await fetch(`/api/public/profile?userId=${encodeURIComponent(match.userId)}`, { cache: 'no-store' });
          const data2 = await res2.json();
          if (res2.ok) setProfile(data2 as PublicProfile);
        } finally {
          setProfileLoading(false);
        }
      }
    } catch (e: any) {
      setMessage(e.message || 'Failed to record redemption');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--color-porcelain)] min-h-screen py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="kicker mb-3">Admin</p>
          <h1 className="text-serif text-4xl text-[var(--color-accent)] leading-tight">Cashier</h1>
          <p className="text-[var(--color-ink)]/70 mt-2">Search a member and mark as paid.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[var(--color-ink)]/10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">Search</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type email or name"
              className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
            />
            {!!matches.length && (
              <div className="mt-2 bg-white border border-[var(--color-ink)]/10 rounded-xl overflow-hidden">
                {matches.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setQuery(s.email)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-porcelain)]/50 transition-colors"
                  >
                    {s.name} — {s.email}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected member profile and actions */}
          {selected && (
            <div className="mt-8 grid gap-6">
              <div className="border border-[var(--color-ink)]/10 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[var(--color-ink)] font-medium">{selected.name}</p>
                    <p className="text-sm text-[var(--color-ink)]/70">{selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--color-ink)]/70">{selected.planName}</p>
                    <p className="text-xs uppercase font-bold tracking-wide {selected.status === 'active' ? 'text-green-700' : 'text-[var(--color-accent)]'}">{selected.status}</p>
                  </div>
                </div>

                <div className="mt-4">
                  {profileLoading && <p className="text-sm text-[var(--color-ink)]/60">Loading profile…</p>}
                  {profile && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[var(--color-porcelain)]/60 rounded-lg p-3">
                        <p className="text-xs text-[var(--color-ink)]/70">Today</p>
                        <p className="text-sm">Coffee: {profile.usage.today.coffees} · Food: {profile.usage.today.food} · Desserts: {profile.usage.today.desserts}</p>
                      </div>
                      <div className="bg-[var(--color-porcelain)]/60 rounded-lg p-3">
                        <p className="text-xs text-[var(--color-ink)]/70">Remaining</p>
                        <p className="text-sm">
                          {profile.limits.unlimited ? 'Unlimited' : (
                            <>
                              {typeof profile.limits.remainingCoffees === 'number' ? `Coffees: ${profile.limits.remainingCoffees}` : 'Coffees: —'}
                              {' · '}
                              {typeof profile.limits.remainingFood === 'number' ? `Food: ${profile.limits.remainingFood}` : 'Food: —'}
                            </>
                          )}
                        </p>
                      </div>
                      <div className="bg-[var(--color-porcelain)]/60 rounded-lg p-3">
                        <p className="text-xs text-[var(--color-ink)]/70">Member since</p>
                        <p className="text-sm">{new Date(profile.user.memberSince).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Redemption form */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-1">Type</label>
                    <select value={itemType} onChange={e => setItemType(e.target.value as ItemType)} className="w-full px-3 py-2 bg-white border border-[var(--color-ink)]/15 rounded-lg text-sm">
                      <option value="coffee">Coffee</option>
                      <option value="food">Food</option>
                      <option value="dessert">Dessert</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-1">Item name</label>
                    <input value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Iced Latte" className="w-full px-3 py-2 bg-white border border-[var(--color-ink)]/15 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-1">Location</label>
                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 bg-white border border-[var(--color-ink)]/15 rounded-lg text-sm">
                      <option value="Lance Aux Epines">Lance Aux Epines</option>
                      <option value="True Blue">True Blue</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={recordRedemption}
                    disabled={loading || (!selected && matches.length === 0)}
                    className="bg-[var(--color-ink)] text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-[var(--color-ink)]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Working…' : 'Record Redemption'}
                  </button>
                  <button
                    onClick={markPaid}
                    disabled={loading || (!selected && matches.length === 0)}
                    className="bg-[var(--color-accent)] text-white px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing…' : 'Mark Paid & Activate'}
                  </button>
                  {message && <p className="text-sm text-[var(--color-ink)]/70">{message}</p>}
                  {notice && <p className="text-sm text-red-700 font-medium">{notice}</p>}
                </div>

                {/* Recent redemptions */}
                {profile?.usage.recent?.length ? (
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">Recent</p>
                    <div className="divide-y divide-[var(--color-ink)]/10 border border-[var(--color-ink)]/10 rounded-lg">
                      {profile.usage.recent.map(r => (
                        <div key={r.id} className="flex items-center justify-between px-3 py-2">
                          <div>
                            <p className="text-sm">{r.itemName} <span className="text-[var(--color-ink)]/60">({r.itemType})</span></p>
                            <p className="text-xs text-[var(--color-ink)]/60">{new Date(r.redeemedAt).toLocaleString()} {r.location ? `· ${r.location}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Fallback action row */}
          {!selected && (
            <div className="mt-6 flex items-end gap-4">
              <button
                onClick={markPaid}
                disabled={loading || (!selected && matches.length === 0)}
                className="bg-[var(--color-accent)] text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing…' : 'Mark Paid & Activate'}
              </button>
              {message && <p className="text-sm text-[var(--color-ink)]/70">{message}</p>}
            </div>
          )}

          {lastSubscriptionId && (
            <p className="text-xs text-[var(--color-ink)]/60 mt-3">Last subscription ID: {lastSubscriptionId}</p>
          )}
        </div>
      </div>
    </div>
  );
}


