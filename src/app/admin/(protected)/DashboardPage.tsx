"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SubscriberTable } from "@/components/admin/SubscriberTable";
import { EditSubscriberModal } from "@/components/admin/EditSubscriberModal";

// Types
export type SubscriptionStatus = "active" | "unpaid" | "paused" | "cancelled";
export type PlanId = "3-coffees" | "daily-coffee" | "creator" | "unlimited";

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanId;
  planName: string;
  status: SubscriptionStatus;
  mrr: number;
  nextBillingDate: string;
  startDate: string;
  usageCurrent: number;
  usageTotal: number;
  notes: string;
}

// Plan data
const PLANS = {
  "3-coffees": { name: "3 coffees / week", price: 199 },
  "daily-coffee": { name: "Daily coffee", price: 400 },
  "creator": { name: "Creator+", price: 950 },
  "unlimited": { name: "House Unlimited", price: 1500 }
};

// Comprehensive mock data - 25 subscribers
const MOCK_SUBSCRIBERS: Subscriber[] = [];

export default function AdminDashboardPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(MOCK_SUBSCRIBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "all">("all");
  const [planFilter, setPlanFilter] = useState<PlanId | "all">("all");
  const [sortField, setSortField] = useState<keyof Subscriber>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [cashierEmail, setCashierEmail] = useState("");
  const [cashierLoading, setCashierLoading] = useState(false);
  const [cashierMessage, setCashierMessage] = useState<string | null>(null);
  const [cashierSubscriptionId, setCashierSubscriptionId] = useState<string | null>(null);

  // Live-filter table by email as the cashier types
  useEffect(() => {
    setSearchQuery(cashierEmail);
    setCurrentPage(1);
  }, [cashierEmail]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/subscribers', { cache: 'no-store', credentials: 'same-origin' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load subscribers');
        setSubscribers(data.subscribers || []);
      } catch (e) {
        console.warn('Failed to load live subscribers; using mocks');
      }
    })();
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const active = subscribers.filter(s => s.status === "active");
    const totalMRR = active.reduce((sum, s) => sum + s.mrr, 0);
    const totalRevenue = subscribers.reduce((sum, s) => {
      const months = Math.floor(
        (new Date().getTime() - new Date(s.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      return sum + (s.mrr * months);
    }, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = subscribers.filter(
      s => new Date(s.startDate) >= thisMonth
    ).length;
    
    const cancelled = subscribers.filter(s => s.status === "cancelled").length;
    const churnRate = subscribers.length > 0 ? (cancelled / subscribers.length * 100).toFixed(1) : 0;
    
    const avgOrderValue = subscribers.length > 0 
      ? Math.round(subscribers.reduce((sum, s) => sum + (PLANS[s.plan]?.price || 0), 0) / subscribers.length)
      : 0;

    return {
      totalRevenue,
      activeSubscriptions: active.length,
      mrr: totalMRR,
      churnRate,
      newSubscribers: newThisMonth,
      avgOrderValue
    };
  }, [subscribers]);

  // Filter and sort subscribers
  const filteredSubscribers = useMemo(() => {
    let filtered = subscribers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== "all") {
      filtered = filtered.filter(s => s.plan === planFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    return filtered;
  }, [subscribers, searchQuery, statusFilter, planFilter, sortField, sortDirection]);

  // Paginate
  const paginatedSubscribers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSubscribers.slice(startIndex, startIndex + pageSize);
  }, [filteredSubscribers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSubscribers.length / pageSize);

  const handleSort = (field: keyof Subscriber) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEditSubscriber = (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber);
  };

  const handleSaveSubscriber = (updatedSubscriber: Subscriber) => {
    setSubscribers(prev =>
      prev.map(s => (s.id === updatedSubscriber.id ? updatedSubscriber : s))
    );
    setEditingSubscriber(null);
    console.log("Saved subscriber:", updatedSubscriber);
    // In production: API call to update subscriber
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this subscriber and all related data?")) return;
    try {
      const toDelete = subscribers.find(s => s.id === id);
      if (!toDelete) return;
      setSubscribers(prev => prev.filter(s => s.id !== id));
      await fetch('/api/admin/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: toDelete.email })
      });
    } catch (e) {
      // no-op; UI already updated
    }
  };

  return (
    <div className="bg-[var(--color-porcelain)] min-h-screen py-12 lg:py-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="kicker mb-4">Admin Portal</p>
          <h1 className="text-serif text-5xl lg:text-6xl text-[var(--color-accent)] mb-4 leading-tight">
            Subscriber Dashboard
          </h1>
          <p className="text-lg text-[var(--color-ink)]/70 leading-relaxed">
            Manage all subscriptions, view analytics, and edit member details.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-[var(--color-ink)]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-3">
              Total Revenue
            </p>
            <p className="text-serif text-3xl text-[var(--color-accent)] mb-1">
              ${metrics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--color-ink)]/60">All time</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--color-ink)]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-3">
              Active Subs
            </p>
            <p className="text-serif text-3xl text-[var(--color-accent)] mb-1">
              {metrics.activeSubscriptions}
            </p>
            <p className="text-xs text-[var(--color-ink)]/60">Currently active</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--color-ink)]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-3">
              Monthly MRR
            </p>
            <p className="text-serif text-3xl text-[var(--color-accent)] mb-1">
              ${metrics.mrr.toLocaleString()}
            </p>
            <p className="text-xs text-[var(--color-ink)]/60">Recurring revenue</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--color-ink)]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-3">
              Churn Rate
            </p>
            <p className="text-serif text-3xl text-[var(--color-accent)] mb-1">
              {metrics.churnRate}%
            </p>
            <p className="text-xs text-[var(--color-ink)]/60">Cancellation rate</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--color-ink)]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-3">
              New This Month
            </p>
            <p className="text-serif text-3xl text-[var(--color-accent)] mb-1">
              {metrics.newSubscribers}
            </p>
            <p className="text-xs text-[var(--color-ink)]/60">October 2025</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[var(--color-ink)]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-3">
              Avg Order Value
            </p>
            <p className="text-serif text-3xl text-[var(--color-accent)] mb-1">
              ${metrics.avgOrderValue}
            </p>
            <p className="text-xs text-[var(--color-ink)]/60">Per subscriber</p>
          </div>
        </div>

        {/* Cashier Tools */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[var(--color-ink)]/10 mb-12">
          <h2 className="text-serif text-3xl text-[var(--color-accent)] mb-6">Cashier Tools</h2>
          <div className="grid grid-cols-1 gap-4 mb-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">Search by Email</label>
              <input
                type="email"
                value={cashierEmail}
                onChange={e => setCashierEmail(e.target.value)}
                placeholder="e.g. jane@example.com"
                className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
              />
              {cashierEmail && (
                <div className="mt-2 bg-white border border-[var(--color-ink)]/10 rounded-xl overflow-hidden">
                  {(subscribers || []).filter(s => s.email.toLowerCase().includes(cashierEmail.toLowerCase())).slice(0,5).map(s => (
                    <button
                      key={s.id}
                      onClick={() => setCashierEmail(s.email)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-porcelain)]/50 transition-colors"
                    >
                      {s.name} — {s.email}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-end">
              <button
                onClick={async () => {
                  try {
                    setCashierLoading(true);
                    setCashierMessage(null);
                    const match = (subscribers || []).find(s => s.email.toLowerCase() === cashierEmail.trim().toLowerCase());
                    if (!match) throw new Error('Select a valid user from the list');
                    // 1) Ensure a pending subscription exists (reuse /api/join)
                    const resJoin = await fetch('/api/join', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: 'Walk-in',
                        email: cashierEmail,
                        planId: match.plan,
                      }),
                    });
                    const joinData = await resJoin.json();
                    if (!resJoin.ok) throw new Error(joinData.error || 'Join failed');
                    const subId = joinData.subscription.id as string;
                    setCashierSubscriptionId(subId);

                    // 2) Activate immediately (paid in cash)
                    const resStatus = await fetch('/api/membership/status', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ subscriptionId: subId, status: 'paid' }),
                    });
                    const statusData = await resStatus.json();
                    if (!resStatus.ok) throw new Error(statusData.error || 'Activation failed');
                    setCashierMessage('Activated and emailed receipt.');
                  } catch (e: any) {
                    setCashierMessage(e.message || 'Error activating member');
                  } finally {
                    setCashierLoading(false);
                  }
                }}
                className="w-full bg-[var(--color-accent)] text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-[var(--color-accent)]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={cashierLoading || !subscribers.some(s => s.email.toLowerCase() === cashierEmail.trim().toLowerCase())}
              >
                {cashierLoading ? 'Processing…' : 'Mark Paid & Activate'}
              </button>
            </div>
            <div className="flex items-end">
              {cashierMessage ? (
                <p className="text-sm text-[var(--color-ink)]/70">{cashierMessage}</p>
              ) : (
                cashierEmail.trim() && (
                  (() => {
                    const m = (subscribers || []).find(s => s.email.toLowerCase() === cashierEmail.trim().toLowerCase());
                    return m ? (
                      <p className="text-sm text-[var(--color-ink)]/60">Selected: {m.name} • Plan: {m.planName}</p>
                    ) : (
                      <p className="text-sm text-[var(--color-ink)]/60">Type to search and select a user.</p>
                    );
                  })()
                )
              )}
            </div>
          </div>
          {cashierSubscriptionId && (
            <p className="text-xs text-[var(--color-ink)]/60">Last subscription ID: {cashierSubscriptionId}</p>
          )}
        </div>

        {/* Subscribers Table Section */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[var(--color-ink)]/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <h2 className="text-serif text-3xl text-[var(--color-accent)]">
              All Subscribers
            </h2>
            <Button
              variant="secondary"
              onClick={() => {
                console.log("Export data:", filteredSubscribers);
                alert("Export functionality - would download CSV");
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10L12 15L17 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 15V3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value as SubscriptionStatus | "all");
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="unpaid">Unpaid</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">
                Plan
              </label>
              <select
                value={planFilter}
                onChange={e => {
                  setPlanFilter(e.target.value as PlanId | "all");
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
              >
                <option value="all">All Plans</option>
                <option value="3-coffees">3 coffees / week</option>
                <option value="daily-coffee">Daily coffee</option>
                <option value="creator">Creator+</option>
                <option value="unlimited">House Unlimited</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-[var(--color-ink)]/60 mb-4">
            Showing {paginatedSubscribers.length} of {filteredSubscribers.length} subscribers
          </p>

          {/* Table */}
          <SubscriberTable
            subscribers={paginatedSubscribers}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={handleEditSubscriber}
            onDelete={handleDeleteSubscriber}
          />

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-[var(--color-ink)]/10">
            <div className="flex items-center gap-3">
              <label className="text-sm text-[var(--color-ink)]/70">
                Rows per page:
              </label>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-white border border-[var(--color-ink)]/15 rounded-lg text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[var(--color-porcelain)] text-[var(--color-accent)] rounded-lg text-sm font-medium hover:bg-[var(--color-porcelain)]/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--color-ink)]/70 px-4">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-[var(--color-porcelain)] text-[var(--color-accent)] rounded-lg text-sm font-medium hover:bg-[var(--color-porcelain)]/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSubscriber && (
        <EditSubscriberModal
          subscriber={editingSubscriber}
          onSave={handleSaveSubscriber}
          onClose={() => setEditingSubscriber(null)}
        />
      )}
    </div>
  );
}


