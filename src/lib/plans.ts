export type PlanId = 'chill-mode' | 'daily-coffee' | 'double-shot' | 'caffeine-royalty';

export function normalizePlanId(rawPlanId: string): PlanId {
  switch (rawPlanId) {
    case '3-coffees':
      return 'chill-mode';
    case 'creator':
      return 'double-shot';
    case 'unlimited':
      return 'caffeine-royalty';
    case 'daily-coffee':
      return 'daily-coffee';
    case 'chill-mode':
    case 'double-shot':
    case 'caffeine-royalty':
      return rawPlanId as PlanId;
    default:
      // Default to daily-coffee if unknown
      return 'daily-coffee';
  }
}

export function getPlanDisplayName(planId: string): string {
  const normalized = normalizePlanId(planId);
  const names: Record<PlanId, string> = {
    'chill-mode': 'Chill Mode — 12 Coffees / Month',
    'daily-coffee': 'Daily Fix — 30 Coffees / Month',
    'double-shot': 'Double Shot — 60 Coffees / Month',
    'caffeine-royalty': 'Caffeine Royalty — 120 Coffees / Month',
  };
  return names[normalized];
}

export const PLAN_PRICES: Record<PlanId, string> = {
  'chill-mode': '$199',
  'daily-coffee': '$400',
  'double-shot': '$950',
  'caffeine-royalty': '$1500',
};

export function isBundlePlan(planId: string): boolean {
  const normalized = normalizePlanId(planId);
  return normalized === 'double-shot' || normalized === 'caffeine-royalty';
}

export function getMonthlyCoffeeAllowance(planId: string): number {
  switch (normalizePlanId(planId)) {
    case 'chill-mode':
      return 12;
    case 'daily-coffee':
      return 30;
    case 'double-shot':
      return 60;
    case 'caffeine-royalty':
      return 120;
    default:
      return 30;
  }
}


