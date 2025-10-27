"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Subscriber, SubscriptionStatus, PlanId } from "@/app/admin/page";

interface EditSubscriberModalProps {
  subscriber: Subscriber;
  onSave: (subscriber: Subscriber) => void;
  onClose: () => void;
}

const PLANS = {
  "3-coffees": { name: "3 coffees / week", price: 199, usage: 12 },
  "daily-coffee": { name: "Daily coffee", price: 400, usage: 30 },
  "creator": { name: "Creator+", price: 950, usage: 60 },
  "unlimited": { name: "House Unlimited", price: 1500, usage: 999 }
};

export function EditSubscriberModal({
  subscriber,
  onSave,
  onClose
}: EditSubscriberModalProps) {
  const [formData, setFormData] = useState<Subscriber>(subscriber);
  const [showRefundInput, setShowRefundInput] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [markPaidLoading, setMarkPaidLoading] = useState(false);

  const handlePlanChange = (newPlan: PlanId) => {
    const planData = PLANS[newPlan];
    setFormData({
      ...formData,
      plan: newPlan,
      planName: planData.name,
      mrr: formData.status === "active" ? planData.price : 0,
      usageTotal: planData.usage
    });
  };

  const handleStatusChange = (newStatus: SubscriptionStatus) => {
    const planPrice = PLANS[formData.plan].price;
    setFormData({
      ...formData,
      status: newStatus,
      mrr: newStatus === "active" ? planPrice : 0
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleIssueRefund = () => {
    if (refundAmount && Number(refundAmount) > 0) {
      console.log(`Refunding $${refundAmount} to ${subscriber.name}`);
      alert(`Refund of $${refundAmount} issued successfully!`);
      setShowRefundInput(false);
      setRefundAmount("");
      // In production: API call to process refund
    }
  };

  const handlePause = () => {
    handleStatusChange("paused");
    console.log(`Paused subscription for ${subscriber.name}`);
    // In production: API call to pause subscription
  };

  const handleCancelSubscription = () => {
    handleStatusChange("cancelled");
    setShowConfirmCancel(false);
    console.log(`Cancelled subscription for ${subscriber.name}`);
    // In production: API call to cancel subscription
  };

  const handleResetUsage = () => {
    setFormData({
      ...formData,
      usageCurrent: 0
    });
    console.log(`Reset usage counter for ${subscriber.name}`);
    // In production: API call to reset usage
  };

  const handleSendWelcomeEmail = () => {
    console.log(`Sending welcome email to ${subscriber.email}`);
    alert(`Welcome email sent to ${subscriber.email}!`);
    // In production: API call to send email
  };

  const handleMarkAsPaid = async () => {
    try {
      setMarkPaidLoading(true);
      const resJoin = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name || 'Member', email: formData.email, phone: formData.phone, planId: formData.plan }),
      });
      const joinData = await resJoin.json();
      if (!resJoin.ok) throw new Error(joinData.error || 'Join failed');
      const subId = joinData.subscription.id as string;
      const resStatus = await fetch('/api/membership/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subId, status: 'paid' }),
      });
      const statusData = await resStatus.json();
      if (!resStatus.ok) throw new Error(statusData.error || 'Activation failed');
      alert('Marked as paid and activated.');
    } catch (e: any) {
      alert(e.message || 'Failed to mark as paid');
    } finally {
      setMarkPaidLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-serif text-3xl text-[var(--color-accent)] mb-2">
              Edit Subscriber
            </h2>
            <p className="text-sm text-[var(--color-ink)]/60">
              ID: {subscriber.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-porcelain)] rounded-lg transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[var(--color-ink)]"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Subscription Details */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-4">
            Subscription Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">
                Plan
              </label>
              <select
                value={formData.plan}
                onChange={e => handlePlanChange(e.target.value as PlanId)}
                className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
              >
                <option value="3-coffees">3 coffees / week - $199</option>
                <option value="daily-coffee">Daily coffee - $400</option>
                <option value="creator">Creator+ - $950</option>
                <option value="unlimited">House Unlimited - $1500</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => handleStatusChange(e.target.value as SubscriptionStatus)}
                className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all"
              >
                <option value="active">Active</option>
                <option value="unpaid">Unpaid</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <Input
              label="Next Billing Date"
              type="date"
              value={formData.nextBillingDate}
              onChange={e =>
                setFormData({ ...formData, nextBillingDate: e.target.value })
              }
            />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]/70 mb-2">
                MRR
              </label>
              <input
                type="text"
                value={`$${formData.mrr}`}
                disabled
                className="w-full px-4 py-3 bg-[var(--color-porcelain)]/30 border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Usage Tracking */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-4">
            Usage Tracking
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Current Usage"
              type="number"
              value={formData.usageCurrent.toString()}
              onChange={e =>
                setFormData({
                  ...formData,
                  usageCurrent: parseInt(e.target.value) || 0
                })
              }
            />
            <Input
              label="Total Allowed"
              type="number"
              value={formData.usageTotal.toString()}
              onChange={e =>
                setFormData({
                  ...formData,
                  usageTotal: parseInt(e.target.value) || 0
                })
              }
            />
          </div>
          <div className="bg-[var(--color-porcelain)]/30 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--color-ink)]/70">Progress</span>
              <span className="font-medium text-[var(--color-accent)]">
                {formData.usageCurrent} / {formData.usageTotal}
              </span>
            </div>
            <div className="relative h-2 bg-white rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-[var(--color-accent)] rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (formData.usageCurrent / formData.usageTotal) * 100,
                    100
                  )}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">
            Admin Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Internal notes about this subscriber..."
            rows={3}
            className="w-full px-4 py-3 bg-white border border-[var(--color-ink)]/15 rounded-xl text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-all resize-none"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-accent)] mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleMarkAsPaid}
              disabled={markPaidLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-bold uppercase tracking-wide"
            >
              {markPaidLoading ? 'Marking…' : 'Mark as Paid'}
            </button>
            <button
              onClick={() => setShowRefundInput(!showRefundInput)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-porcelain)] text-[var(--color-accent)] rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 4H1M5 1V7M19 1V7M1 10H23V20C23 20.5304 22.7893 21.0391 22.4142 21.4142C22.0391 21.7893 21.5304 22 21 22H3C2.46957 22 1.96086 21.7893 1.58579 21.4142C1.21071 21.0391 1 20.5304 1 20V10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Issue Refund
            </button>

            <button
              onClick={handlePause}
              disabled={formData.status === "paused"}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-porcelain)] text-[var(--color-accent)] rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 9V15M14 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Pause Subscription
            </button>

            <button
              onClick={() => setShowConfirmCancel(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold uppercase tracking-wide"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Cancel Subscription
            </button>

            <button
              onClick={handleResetUsage}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-porcelain)] text-[var(--color-accent)] rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4V10H7M23 20V14H17M20.49 9C19.9828 7.56678 19.1209 6.28536 17.9845 5.27541C16.8482 4.26546 15.4745 3.55978 13.9917 3.22433C12.5089 2.88888 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1111 10.0083 20.7757C8.52547 20.4402 7.1518 19.7345 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Reset Usage
            </button>

            <button
              onClick={handleSendWelcomeEmail}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-porcelain)] text-[var(--color-accent)] rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide sm:col-span-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 6L12 13L2 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Send Welcome Email
            </button>
          </div>

          {/* Refund Input */}
          {showRefundInput && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2">
                Refund Amount
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0.00"
                  value={refundAmount}
                  onChange={e => setRefundAmount(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white border border-[var(--color-ink)]/15 rounded-lg text-sm"
                />
                <button
                  onClick={handleIssueRefund}
                  className="px-6 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[var(--color-accent)]/90 transition-colors"
                >
                  Process
                </button>
              </div>
            </div>
          )}

          {/* Cancel Confirmation */}
          {showConfirmCancel && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-red-800 mb-3">
                Are you sure you want to cancel this subscription? This action will set
                the status to cancelled.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmCancel(false)}
                  className="flex-1 px-4 py-2 bg-white text-[var(--color-ink)] rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors"
                >
                  Keep Active
                </button>
                <button
                  onClick={handleCancelSubscription}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-red-700 transition-colors"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex gap-3 pt-6 border-t border-[var(--color-ink)]/10">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[var(--color-porcelain)] text-[var(--color-accent)] rounded-xl hover:bg-[var(--color-porcelain)]/70 transition-colors text-sm font-bold uppercase tracking-wide"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl hover:bg-[var(--color-accent)]/90 transition-colors text-sm font-bold uppercase tracking-wide"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

