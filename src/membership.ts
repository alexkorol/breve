import { getSetting, setSetting } from './storage';

/**
 * Membership plan scaffold. The app currently ships free-tier only; when
 * payments land, the purchase flow should call `savePlan` with the paid tier
 * and expiry, and everything below lights up (Settings shows the Membership
 * section, including the "I met my goal" gift flow).
 */
export type PlanTier = 'free' | 'paid';

export interface Plan {
  tier: PlanTier;
  /** Epoch ms when the paid membership expires. Absent on free. */
  expiresAt?: number;
}

export function loadPlan(): Plan {
  try {
    const raw = getSetting('plan');
    if (!raw) return { tier: 'free' };
    const parsed = JSON.parse(raw) as Plan;
    if (parsed.tier === 'paid' && (parsed.expiresAt ?? 0) > Date.now()) return parsed;
    return { tier: 'free' };
  } catch {
    return { tier: 'free' };
  }
}

export function savePlan(plan: Plan): void {
  setSetting('plan', plan.tier === 'free' ? '' : JSON.stringify(plan));
}

/** Whole days of paid membership left to give away. */
export function remainingDays(plan: Plan): number {
  if (plan.tier !== 'paid' || !plan.expiresAt) return 0;
  return Math.max(0, Math.floor((plan.expiresAt - Date.now()) / 86400000));
}

export interface GiftGrant {
  recipient: string;
  days: number;
  /** Redemption code the recipient enters (or a link embedding it). */
  code: string;
}

/**
 * "I met my goal" — split the remainder of a paid membership between one or
 * more friends and stop being a subscriber.
 *
 * TODO(payments): this is a local scaffold. Once the payments backend exists,
 * this must call it to void the sender's remaining term and mint real
 * redemption codes; the codes generated here are placeholders and redeem
 * nothing.
 */
export function createGiftGrants(plan: Plan, recipients: string[]): GiftGrant[] {
  const names = recipients.map((r) => r.trim()).filter(Boolean);
  const days = remainingDays(plan);
  if (names.length === 0 || days < names.length) return [];
  const share = Math.floor(days / names.length);
  return names.map((recipient) => ({
    recipient,
    days: share,
    code: `JIMOTHY-GIFT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  }));
}
