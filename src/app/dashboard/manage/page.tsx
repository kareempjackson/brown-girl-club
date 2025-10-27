"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    id: "3-coffees",
    title: "3 coffees / week",
    price: "$199",
    priceValue: 199,
    savings: "save $65",
    benefits: ["Food specials & discounts", "Pause, skip or cancel anytime", "Member-only perks"]
  },
  {
    id: "daily-coffee",
    title: "Daily coffee",
    price: "$400",
    priceValue: 400,
    savings: "save $216",
    benefits: ["1 coffee per day", "20% off food items", "1 free dessert per week"],
    current: true
  },
  {
    id: "creator",
    title: "Creator+",
    price: "$950",
    priceValue: 950,
    savings: "save $282",
    benefits: ["2 coffees per day", "20% off food items", "1 free lunch per week"]
  },
  {
    id: "unlimited",
    title: "House Unlimited",
    price: "$1500",
    priceValue: 1500,
    benefits: ["Unlimited coffee", "20% off food items", "Choice: 1 free breakfast or lunch per week"]
  }
];

export default function ManageSubscriptionPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseDuration, setPauseDuration] = useState("1");
  const [cancelReason, setCancelReason] = useState("");

  return (
    <div className="bg-[var(--color-porcelain)] min-h-screen py-12 lg:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] mb-6 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-serif text-5xl lg:text-6xl text-[var(--color-accent)] mb-4 leading-tight">
            Manage Subscription
          </h1>
          <p className="text-lg text-[var(--color-ink)]/70 leading-relaxed">
            Update your plan, pause, or cancel your membership.
          </p>
        </div>

        {/* Change Plan Section */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-serif text-3xl text-[var(--color-accent)] mb-3">
              Change Your Plan
            </h2>
            <p className="text-base text-[var(--color-ink)]/70 leading-relaxed">
              Upgrade or downgrade anytime. Changes take effect at the start of your next billing cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl p-8 border-2 transition-all ${
                  plan.current
                    ? "border-[var(--color-accent)] relative"
                    : "border-[var(--color-ink)]/10 hover:border-[var(--color-accent)]/30"
                }`}
              >
                {plan.current && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-[var(--color-accent)] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                      Current Plan
                    </span>
                  </div>
                )}

                <h3 className="text-serif text-2xl text-[var(--color-accent)] mb-2 leading-tight">
                  {plan.title}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-3xl font-light text-[var(--color-ink)]">
                    {plan.price}
                  </p>
                  {plan.savings && (
                    <span className="text-sm text-[var(--color-ink)]/60">({plan.savings})</span>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg 
                        className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span className="text-sm text-[var(--color-ink)]/80 leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.current}
                  className={`w-full py-3 px-6 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors ${
                    plan.current
                      ? "bg-[var(--color-porcelain)] text-[var(--color-ink)]/40 cursor-not-allowed"
                      : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90"
                  }`}
                >
                  {plan.current ? "Current Plan" : "Switch to This Plan"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Pause Subscription Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 lg:p-10 border border-[var(--color-ink)]/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[var(--color-porcelain)] flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--color-accent)]">
                  <path d="M10 9V15M14 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-serif text-2xl text-[var(--color-accent)] mb-3">
                  Pause Subscription
                </h2>
                <p className="text-base text-[var(--color-ink)]/70 leading-relaxed mb-6">
                  Take a break from your membership. Your subscription will be paused, and you won't be charged during this time. You can resume anytime.
                </p>

                <div className="bg-[var(--color-porcelain)]/50 rounded-xl p-6 mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                    Pause Duration
                  </label>
                  <select
                    value={pauseDuration}
                    onChange={(e) => setPauseDuration(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-[var(--color-ink)]/15 rounded-xl text-base text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
                  >
                    <option value="1">1 month</option>
                    <option value="2">2 months</option>
                    <option value="3">3 months</option>
                  </select>
                </div>

                <Button 
                  variant="secondary"
                  onClick={() => setShowPauseModal(true)}
                >
                  Pause Subscription
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cancel Subscription Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 lg:p-10 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-serif text-2xl text-red-700 mb-3">
                  Cancel Subscription
                </h2>
                <p className="text-base text-[var(--color-ink)]/70 leading-relaxed mb-6">
                  We're sorry to see you go. Your subscription will remain active until the end of your current billing period.
                </p>

                <div className="bg-red-50 rounded-xl p-6 mb-6">
                  <p className="text-sm text-red-800 leading-relaxed mb-4">
                    <strong>What happens when you cancel:</strong>
                  </p>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>You'll keep your benefits until January 15, 2025</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>No more charges after your current period ends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span>You can rejoin anytime with the same benefits</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowCancelModal(true)}
                  className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm font-bold uppercase tracking-wide"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section>
          <div className="bg-[var(--color-porcelain)]/50 rounded-2xl p-8 text-center border border-[var(--color-ink)]/10">
            <h3 className="text-serif text-2xl text-[var(--color-accent)] mb-3">
              Need Help?
            </h3>
            <p className="text-base text-[var(--color-ink)]/70 leading-relaxed mb-6 max-w-2xl mx-auto">
              Have questions about your subscription? Our support team is here to help Monday–Friday, 9am–6pm.
            </p>
            <Link href="/support">
              <Button variant="secondary">
                Contact Support
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-serif text-2xl text-[var(--color-accent)] mb-4">
              Pause Subscription
            </h3>
            <p className="text-base text-[var(--color-ink)]/70 leading-relaxed mb-6">
              Your subscription will be paused for {pauseDuration} month{pauseDuration !== "1" ? "s" : ""}. You won't be charged during this time and can resume anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 bg-[var(--color-porcelain)] text-[var(--color-accent)] px-6 py-3 rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle pause logic
                  console.log("Pausing for", pauseDuration, "months");
                  setShowPauseModal(false);
                }}
                className="flex-1 bg-[var(--color-accent)] text-white px-6 py-3 rounded-xl hover:bg-[var(--color-accent)]/90 transition-colors text-sm font-bold uppercase tracking-wide"
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-serif text-2xl text-red-700 mb-4">
              Cancel Subscription
            </h3>
            <p className="text-base text-[var(--color-ink)]/70 leading-relaxed mb-6">
              We're sad to see you go. Would you mind telling us why you're canceling?
            </p>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                Reason (Optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Let us know how we can improve..."
                rows={4}
                className="w-full px-5 py-4 bg-white border border-[var(--color-ink)]/15 rounded-xl text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-[var(--color-porcelain)] text-[var(--color-accent)] px-6 py-3 rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  // Handle cancel logic
                  console.log("Canceling with reason:", cancelReason);
                  setShowCancelModal(false);
                }}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm font-bold uppercase tracking-wide"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

