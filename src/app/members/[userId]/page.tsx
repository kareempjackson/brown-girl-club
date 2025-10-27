'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PublicProfileResponse {
  user: {
    id: string;
    name: string;
    memberSince: string;
  };
  subscription: null | {
    id: string;
    planId: string;
    planName: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    createdAt: string;
  };
  limits?: {
    remainingCoffees?: number | null;
    remainingFood?: number | null;
    unlimited?: boolean;
  };
  usage?: {
    today: { coffees: number; food: number; desserts: number; total: number };
    recent: Array<{ id: string; itemType: string; itemName: string | null; redeemedAt: string; location?: string | null }>;
  };
  error?: string;
}

export default function PublicMemberProfilePage() {
  const params = useParams();
  const userId = (params?.userId as string) || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PublicProfileResponse | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/public/profile?userId=${encodeURIComponent(userId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');
        setProfile(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    if (userId) load();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading member profile...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4">Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'Member not found'}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  const { user, subscription, limits, usage } = profile;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-1">🧺 Brown Girl Club</h1>
          <p className="text-gray-600">Member Profile</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 text-sm mt-1">Member since {new Date(user.memberSince).toLocaleDateString()}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {subscription?.status || 'Inactive'}
            </div>
          </div>

          {subscription ? (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{subscription.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className="font-medium">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
              </div>
              {limits && (typeof limits.remainingCoffees !== 'undefined' || typeof limits.remainingFood !== 'undefined') && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium">
                    {limits.unlimited ? 'Unlimited' : [
                      typeof limits.remainingCoffees === 'number' ? `${limits.remainingCoffees} coffee` : null,
                      typeof limits.remainingFood === 'number' ? `${limits.remainingFood} food` : null,
                    ].filter(Boolean).join(' · ')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="border-t pt-4">
              <p className="text-gray-600">No active subscription.</p>
            </div>
          )}
        </Card>

        {usage && usage.recent && usage.recent.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {usage.recent.map((u) => (
                <div key={u.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {u.itemType === 'coffee' && '☕'}
                    {u.itemType === 'food' && '🥐'}
                    {u.itemType === 'dessert' && '🍰'}{' '}
                    {u.itemName || 'Item'}
                  </span>
                  <span className="text-gray-500">{new Date(u.redeemedAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}


