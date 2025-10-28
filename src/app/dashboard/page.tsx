"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import { PLAN_PRICES, getPlanDisplayName, isBundlePlan, normalizePlanId, getMonthlyCoffeeAllowance } from "@/lib/plans";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const userId = null;
  const email = null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [showDownloadPass, setShowDownloadPass] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      const response = await fetch(`/api/user/subscription`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load user data');
      }

      setUserData(data);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--color-porcelain)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto mb-4"></div>
          <p className="text-[var(--color-ink)]/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="bg-[var(--color-porcelain)] min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-serif text-2xl text-[var(--color-accent)] mb-3">
            Unable to Load Dashboard
          </h2>
          <p className="text-[var(--color-ink)]/70 mb-6">
            {error || 'User not found'}
          </p>
          <Link href="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { user, subscription, usage, invoices, allSubscriptions, limits } = userData;
  const hasPending = !subscription && (allSubscriptions || []).some((s: any) => s.status === 'pending_payment');

  // Calculate usage percentage (for progress bar)
  const monthlyTotal = usage?.period?.coffees ?? usage.today.total;
  const monthlyAllowance = usage?.period?.allowance ?? (subscription ? getMonthlyCoffeeAllowance(subscription.planId) : 30);
  const usagePercentage = monthlyTotal > 0 ? (monthlyTotal / monthlyAllowance) * 100 : 0;

  return (
    <div className="bg-[var(--color-porcelain)] min-h-screen py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="kicker mb-4">Your Dashboard</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-serif text-5xl lg:text-6xl text-[var(--color-accent)] mb-3 leading-tight">
                Welcome back, {user.name.split(' ')[0]}.
              </h1>
              <p className="text-lg text-[var(--color-ink)]/70 leading-relaxed">
                Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              
              <Link href="/dashboard/manage">
                <Button variant="primary" disabled={!subscription}>
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Pending payment banner */}
        {hasPending && (
          <div className="mb-8 bg-white rounded-2xl p-6 border border-yellow-400/40">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500"></div>
              <div>
                <h3 className="text-serif text-xl text-[var(--color-accent)] mb-1">Payment Needed</h3>
                <p className="text-sm text-[var(--color-ink)]/80">Your membership is created but not active yet. Please complete payment at a Brown Girl Club location to activate your plan.</p>
              </div>
            </div>
          </div>
        )}

        {/* Download Pass Modal/Dropdown */}
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Current Plan & Usage */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan Card */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 border border-[var(--color-ink)]/10 relative overflow-hidden">
              {/* Status Badge */}
              <div className="absolute top-6 right-6">
                {subscription ? (
                  <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Inactive
                  </span>
                )}
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-4">
                Current Plan
              </p>
              
              <h2 className="text-serif text-3xl lg:text-4xl text-[var(--color-accent)] mb-2 leading-tight">
                {subscription ? getPlanDisplayName(subscription.planId) : 'No Active Plan'}
              </h2>
              
              <p className="text-2xl text-[var(--color-ink)] mb-6">
                {subscription ? PLAN_PRICES[normalizePlanId(subscription.planId)] || '' : ''}
                {subscription && (
                  <span className="text-base text-[var(--color-ink)]/60 ml-2">/ month</span>
                )}
              </p>

              {/* Remaining Items (per plan limits) */}
              {subscription && (
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1 font-bold">
                    Remaining
                  </p>
                  <p className="text-base text-[var(--color-ink)]">
                    {(() => {
                      const planId = normalizePlanId(subscription.planId);
                      const rC = limits?.remainingCoffees ?? undefined;
                      const rF = limits?.remainingFood ?? undefined;
                      const allowance = usage?.period?.allowance ?? 30;
                      const used = usage?.period?.coffees ?? 0;
                      if (['chill-mode','daily-coffee','double-shot','caffeine-royalty'].includes(planId)) {
                        return `${Math.max(0, allowance - used)} of ${allowance} coffees remaining this period`;
                      }
                      if ((subscription.planId as any) === '3-coffees') {
                        return `${rC ?? 0}/3 coffees remaining this week`;
                      }
                      if ((subscription.planId as any) === 'creator') {
                        return `Today: ${rC ?? 0}/1 coffee, ${rF ?? 0}/1 food`;
                      }
                      if ((subscription.planId as any) === 'unlimited') {
                        return 'Unlimited access';
                      }
                      return getPlanDisplayName(subscription.planId);
                    })()}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1 font-bold">
                    Period End
                  </p>
                  <p className="text-base text-[var(--color-ink)]">
                    {subscription ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1 font-bold">
                    Period Start
                  </p>
                  <p className="text-base text-[var(--color-ink)]">
                    {subscription ? new Date(subscription.currentPeriodStart).toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>

              <hr className="border-[var(--color-ink)]/10 my-6" />

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/manage" className="flex-1">
                  <button className="w-full bg-[var(--color-porcelain)] text-[var(--color-accent)] px-6 py-3 rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide">
                    Change Plan
                  </button>
                </Link>
                <Link href="/dashboard/manage#billing" className="flex-1">
                  <button className="w-full bg-[var(--color-porcelain)] text-[var(--color-accent)] px-6 py-3 rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide">
                    Update Payment
                  </button>
                </Link>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 border border-[var(--color-ink)]/10">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">
                    Monthly Usage
                  </p>
                  <h3 className="text-serif text-3xl text-[var(--color-accent)]">
                    {monthlyTotal} / {monthlyAllowance}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)]/60 mt-1">
                    Today: {usage.today.coffees} coffee, {usage.today.food} food, {usage.today.desserts} dessert
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-light text-[var(--color-accent)]">
                    {Math.max(0, monthlyAllowance - monthlyTotal)}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/60 mt-1">
                    Remaining
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-[var(--color-porcelain)] rounded-full overflow-hidden mb-4">
                <div 
                  className="absolute top-0 left-0 h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>

              <p className="text-sm text-[var(--color-ink)]/60 leading-relaxed">
                {subscription ? (
                  usage?.period ? (
                    <>Your usage period ends on {new Date(usage.period.end).toLocaleDateString()}.</>
                  ) : (
                    <>Your usage period ends on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.</>
                  )
                ) : (
                  <>Activate your membership to start tracking usage.</>
                )}
              </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 lg:p-10 border border-[var(--color-ink)]/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-serif text-2xl text-[var(--color-accent)]">
                  Recent Activity
                </h3>
                <button className="text-sm font-bold text-[var(--color-accent)] uppercase tracking-wide hover:opacity-70 transition-opacity">
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {usage.recent.map((activity: any) => (
                  <div 
                    key={activity.id}
                    className="flex items-center justify-between py-4 border-b border-[var(--color-ink)]/5 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-porcelain)] flex items-center justify-center flex-shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-accent)]">
                          <path d="M20 26h24v10c0 6-4 10-10 10h-4c-6 0-10-4-10-10V26z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M44 26h6c3 0 6 3 6 6s-3 6-6 6h-6" stroke="currentColor" strokeWidth="2"/>
                          <path d="M26 18s2-2 6-2 6 2 6 2" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-ink)]">{activity.itemName || activity.itemType}</p>
                        <p className="text-xs text-[var(--color-ink)]/60">{activity.location || '—'} · {new Date(activity.redeemedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--color-ink)]/60">{activity.itemType}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions, Members & Billing */}
          <div className="space-y-8">
            {/* Bundle Members */}
            {subscription && isBundlePlan(subscription.planId) && (
              <div className="bg-white rounded-2xl p-8 border border-[var(--color-ink)]/10">
                <h3 className="text-serif text-xl text-[var(--color-accent)] mb-6">
                  Members on your plan
                </h3>
                <AddMember 
                  remainingInvites={(() => {
                    const planId = normalizePlanId(subscription.planId);
                    const maxSeats = planId === 'double-shot' ? 2 : 4;
                    const currentSeats = 1 + ((userData.members || []).length || 0);
                    return Math.max(0, maxSeats - currentSeats);
                  })()}
                  onSent={() => {
                    // Refresh after sending invite
                    fetch('/api/user/subscription').then(r => r.json()).then(setUserData).catch(() => {});
                  }}
                />
                <div className="mt-6 space-y-3">
                  {(userData.members || []).map((m: any) => (
                    <div key={m.id || m.email} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-porcelain)]/40">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-ink)]">{m.name || 'Member'}</p>
                        <p className="text-xs text-[var(--color-ink)]/60">{m.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 border border-[var(--color-ink)]/10">
              <h3 className="text-serif text-xl text-[var(--color-accent)] mb-6">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link href="/dashboard/manage">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-[var(--color-porcelain)]/50 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-accent)]">
                        <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm font-medium text-[var(--color-ink)]">
                        Pause Subscription
                      </span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-ink)]/30 group-hover:text-[var(--color-accent)] transition-colors">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Link>

                <Link href="/dashboard/manage">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-[var(--color-porcelain)]/50 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-accent)]">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm font-medium text-[var(--color-ink)]">
                        Upgrade Plan
                      </span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-ink)]/30 group-hover:text-[var(--color-accent)] transition-colors">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Link>

                {/* <button 
                  onClick={() => setShowDownloadPass(!showDownloadPass)}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-[var(--color-porcelain)]/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-accent)]">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-sm font-medium text-[var(--color-ink)]">
                      Resend Pass
                    </span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-ink)]/30 group-hover:text-[var(--color-accent)] transition-colors">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <Link href="/support">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-[var(--color-porcelain)]/50 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-accent)]">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm font-medium text-[var(--color-ink)]">
                        Contact Support
                      </span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-ink)]/30 group-hover:text-[var(--color-accent)] transition-colors">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Link> */}
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-2xl p-8 border border-[var(--color-ink)]/10">
              <h3 className="text-serif text-xl text-[var(--color-accent)] mb-6">
                Billing History
              </h3>
              
              <div className="space-y-4">
                {(invoices || []).map((invoice: any) => (
                  <div 
                    key={invoice.id}
                    className="flex items-center justify-between py-3 border-b border-[var(--color-ink)]/5 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--color-ink)] mb-1">{invoice.currency} {Number(invoice.amount).toFixed(2)}</p>
                      <p className="text-xs text-[var(--color-ink)]/60">{invoice.paidAt ? new Date(invoice.paidAt).toLocaleString() : new Date(invoice.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-50 text-green-700">
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 text-sm font-bold text-[var(--color-accent)] uppercase tracking-wide hover:opacity-70 transition-opacity">
                View All Invoices →
              </button>
            </div>

            {/* Account Info */}
            <div className="bg-[var(--color-porcelain)]/50 rounded-2xl p-8 border border-[var(--color-ink)]/10">
              <h3 className="text-serif text-xl text-[var(--color-accent)] mb-4">
                Account Info
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1 font-bold">
                    Email
                  </p>
                  <p className="text-[var(--color-ink)]">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-accent)]/70 mb-1 font-bold">
                    Full Name
                  </p>
                  <p className="text-[var(--color-ink)]">{user.name}</p>
                </div>
              </div>

              <button className="w-full mt-6 text-sm font-bold text-[var(--color-accent)] uppercase tracking-wide hover:opacity-70 transition-opacity text-left">
                Edit Profile →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddMember({ remainingInvites, onSent }: { remainingInvites: number; onSent: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  
  const onInvite = async () => {
    setSending(true);
    setMessage('');
    try {
      const res = await fetch('/api/user/members/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send invite');
      setMessage('Invite sent. Ask them to check their email.');
      setName('');
      setEmail('');
      onSent();
    } catch (e: any) {
      setMessage(e.message || 'Error sending invite');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-[var(--color-ink)]/70 mb-3">Remaining invites: {remainingInvites}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          className="px-3 py-2 rounded-xl border border-[var(--color-ink)]/20"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="px-3 py-2 rounded-xl border border-[var(--color-ink)]/20 sm:col-span-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <Button variant="primary" onClick={onInvite} disabled={sending || !email || remainingInvites <= 0}>
          {sending ? 'Sending…' : 'Invite Member'}
        </Button>
      </div>
      {message && <p className="text-sm text-[var(--color-ink)]/70 mt-2">{message}</p>}
    </div>
  );
}

