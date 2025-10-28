'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const COFFEE_ITEMS = [
  'Americano',
  'Cappuccino',
  'Latte',
  'Flat White',
  'Espresso',
  'Cold Brew',
  'Iced Coffee',
  'Mocha',
];

const FOOD_ITEMS = [
  'Croissant',
  'Muffin',
  'Toast',
  'Bagel',
  'Sandwich',
  'Salad',
];

const DESSERT_ITEMS = [
  'Cookie',
  'Brownie',
  'Cake Slice',
  'Pastry',
];

interface SubscriptionInfo {
  id: string;
  userId: string;
  planName: string;
  planId: string;
  status: string;
  expiresAt: string;
}

interface ValidationResponse {
  subscription?: SubscriptionInfo;
  limits?: {
    remainingCoffees?: number;
    remainingFood?: number;
  };
  usageToday?: any[];
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading scanner…</p>
          </div>
        </Card>
      </div>
    }>
      <RedeemClient />
    </Suspense>
  );
}

function RedeemClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code'); // User ID from QR code

  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [limits, setLimits] = useState<any>({});
  const [usageToday, setUsageToday] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedItemType, setSelectedItemType] = useState<'coffee' | 'food' | 'dessert'>('coffee');
  const [selectedItem, setSelectedItem] = useState('');
  const [location, setLocation] = useState('Main Location');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (code) {
      fetchSubscriptionInfo();
    } else {
      setError('No QR code scanned. Please scan a valid membership QR code.');
      setLoading(false);
    }
  }, [code]);

  const fetchSubscriptionInfo = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/validate?userId=${code}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to validate subscription');
      }

      setSubscription(data.subscription);
      setLimits(data.limits || {});
      setUsageToday(data.usageToday || []);
    } catch (err: any) {
      console.error('Validation error:', err);
      setError(err.message || 'Failed to load subscription info');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedItem) {
      setError('Please select an item to redeem');
      return;
    }

    setValidating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: code,
          itemType: selectedItemType,
          itemName: selectedItem,
          location,
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Redemption failed');
      }

      setSuccess(`✅ ${selectedItem} x${quantity} redeemed successfully!`);
      setSelectedItem('');
      setQuantity(1);
      
      // Refresh subscription info
      await fetchSubscriptionInfo();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Redemption error:', err);
      setError(err.message || 'Failed to redeem item');
    } finally {
      setValidating(false);
    }
  };

  const getPlanLimitText = () => {
    if (!subscription) return '';
    
    switch (subscription.planId) {
      case '3-coffees':
        return `${limits.remainingCoffees || 0}/3 coffees remaining this week`;
      case 'daily-coffee':
        return `${limits.remainingCoffees || 0}/30 coffees remaining this period`;
      case 'creator':
        return `Today: ${limits.remainingCoffees || 0}/1 coffee, ${limits.remainingFood || 0}/1 food`;
      case 'unlimited':
        return 'Unlimited access';
      default:
        return subscription.planName;
    }
  };

  const canRedeemFood = () => {
    return subscription?.planId === 'creator' || subscription?.planId === 'unlimited';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">🧺 Brown Girl Club</h1>
          <p className="text-gray-600">Redemption Scanner</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 rounded-lg text-green-800 text-center font-medium">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Subscription Info Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Member Validated ✅</h2>
              <p className="text-gray-600 text-sm mt-1">User ID: {code?.substring(0, 20)}...</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {subscription?.status || 'Unknown'}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{subscription?.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Usage:</span>
              <span className="font-medium">{getPlanLimitText()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expires:</span>
              <span className="font-medium">
                {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="pt-2 text-right">
              <a
                className="text-sm text-blue-600 hover:underline"
                href={code ? `/members/${encodeURIComponent(code)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open public profile →
              </a>
            </div>
          </div>
        </Card>

        {/* Redemption Interface */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Select Item to Redeem</h3>

          {/* Item Type Selector */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={selectedItemType === 'coffee' ? 'primary' : 'secondary'}
              onClick={() => {
                setSelectedItemType('coffee');
                setSelectedItem('');
              }}
              className="flex-1"
            >
              ☕ Coffee
            </Button>
            <Button
              variant={selectedItemType === 'food' ? 'primary' : 'secondary'}
              onClick={() => {
                setSelectedItemType('food');
                setSelectedItem('');
              }}
              className="flex-1"
              disabled={!canRedeemFood()}
            >
              🥐 Food
            </Button>
            <Button
              variant={selectedItemType === 'dessert' ? 'primary' : 'secondary'}
              onClick={() => {
                setSelectedItemType('dessert');
                setSelectedItem('');
              }}
              className="flex-1"
            >
              🍰 Dessert
            </Button>
          </div>

          {/* Item Selection */}
          <div className="space-y-2 mb-6">
            {selectedItemType === 'coffee' && COFFEE_ITEMS.map((item) => (
              <label
                key={item}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  selectedItem === item
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="item"
                  value={item}
                  checked={selectedItem === item}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium">{item}</span>
              </label>
            ))}

            {selectedItemType === 'food' && FOOD_ITEMS.map((item) => (
              <label
                key={item}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  selectedItem === item
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="item"
                  value={item}
                  checked={selectedItem === item}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium">{item}</span>
              </label>
            ))}

            {selectedItemType === 'dessert' && DESSERT_ITEMS.map((item) => (
              <label
                key={item}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  selectedItem === item
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="item"
                  value={item}
                  checked={selectedItem === item}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="mr-3"
                />
                <span className="font-medium">{item}</span>
              </label>
            ))}
          </div>

          {/* Quantity and Location Inputs */}
          {selectedItemType === 'coffee' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {typeof limits?.remainingCoffees === 'number' && (
                <p className="text-xs text-gray-500 mt-1">Up to {limits.remainingCoffees} remaining this period</p>
              )}
            </div>
          )}

          {/* Location Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Main Store, Downtown Location"
            />
          </div>

          {/* Redeem Button */}
          <Button
            onClick={handleRedeem}
            disabled={!selectedItem || validating}
            className="w-full py-6 text-lg font-semibold"
          >
            {validating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                Processing...
              </>
            ) : (
              `Redeem ${selectedItem || 'Item'}`
            )}
          </Button>
        </Card>

        {/* Today's Usage */}
        {usageToday.length > 0 && (
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-bold mb-3">Today's Activity</h3>
            <div className="space-y-2">
              {usageToday.map((usage, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {usage.item_type === 'coffee' && '☕'}
                    {usage.item_type === 'food' && '🥐'}
                    {usage.item_type === 'dessert' && '🍰'}
                    {' '}{usage.item_name}
                  </span>
                  <span className="text-gray-500">
                    {new Date(usage.redeemed_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
