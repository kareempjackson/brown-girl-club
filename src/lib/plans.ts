export type PlanId =
  // New plans
  | 'daily-brew'
  | 'supreme-brew-club'
  // Legacy plans (kept for backward compatibility/display only)
  | 'chill-mode'
  | 'daily-coffee'
  | 'double-shot'
  | 'caffeine-royalty';

export function normalizePlanId(rawPlanId: string): PlanId {
  switch (rawPlanId) {
    // Legacy aliases
    case '3-coffees':
      return 'chill-mode' as PlanId;
    case 'creator':
      return 'double-shot' as PlanId;
    case 'unlimited':
      return 'caffeine-royalty' as PlanId;
    // Map old to new if needed
    case 'daily-coffee':
      return 'daily-brew';
    // New plans
    case 'daily-brew':
    case 'supreme-brew-club':
      return rawPlanId as PlanId;
    // Legacy supported as-is
    case 'chill-mode':
    case 'double-shot':
    case 'caffeine-royalty':
      return rawPlanId as PlanId;
    default:
      // Default to daily-brew if unknown
      return 'daily-brew';
  }
}

export function getPlanDisplayName(planId: string): string {
  const normalized = normalizePlanId(planId);
  const names: Record<PlanId, string> = {
    // New plans
    'daily-brew': 'The Daily Brew — $25 / month',
    'supreme-brew-club': 'The Supreme Brew Club — $35 / month',
    // Legacy plans (for existing subscribers)
    'chill-mode': 'Chill Mode — 12 Coffees / Month',
    'daily-coffee': 'Daily Fix — 30 Coffees / Month',
    'double-shot': 'Double Shot — 60 Coffees / Month',
    'caffeine-royalty': 'Caffeine Royalty — 120 Coffees / Month',
  };
  return names[normalized as PlanId];
}

export const PLAN_PRICES: Record<PlanId, string> = {
  // New plans (USD)
  'daily-brew': '$25',
  'supreme-brew-club': '$35',
  // Legacy plans (XCD display retained)
  'chill-mode': '$200',
  'daily-coffee': '$450',
  'double-shot': '$800',
  'caffeine-royalty': '$1400',
};

export function isBundlePlan(planId: string): boolean {
  const normalized = normalizePlanId(planId);
  // No bundle plans in new lineup; legacy bundle detection retained
  return normalized === 'double-shot' || normalized === 'caffeine-royalty';
}

export function getMonthlyCoffeeAllowance(planId: string): number {
  switch (normalizePlanId(planId)) {
    // New plans do not have coffee allowances
    case 'chill-mode':
      return 12;
    case 'daily-brew':
      return 30;
    case 'double-shot':
      return 60;
    case 'caffeine-royalty':
      return 120;
    default:
      return 30;
  }
}


