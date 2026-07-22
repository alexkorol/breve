import { registerPlugin } from '@capacitor/core';
import { isNative } from './native';
import { loadPlan, savePlan, type Plan } from './membership';

/**
 * One-time "unlock everything" purchase, backed by a small custom StoreKit 2
 * plugin (ios/App/App/UnlockPlugin.swift). Web builds never call this: gating
 * is native-only, so the plugin is only registered there.
 */

export const UNLOCK_PRODUCT_ID = 'com.alexkorol.jimothy.unlock';

export interface UnlockProduct {
  productId: string;
  /** Localized price string straight from StoreKit, e.g. "$24.99". */
  displayPrice: string;
  title: string;
}

interface UnlockPluginApi {
  getProduct(): Promise<UnlockProduct>;
  purchase(): Promise<{ state: 'purchased' | 'pending' | 'cancelled' }>;
  restore(): Promise<{ owned: boolean }>;
  isOwned(): Promise<{ owned: boolean }>;
}

const Unlock = registerPlugin<UnlockPluginApi>('Unlock');

function lifetimePlan(): Plan {
  return { tier: 'paid' };
}

export async function fetchUnlockProduct(): Promise<UnlockProduct | null> {
  try {
    return await Unlock.getProduct();
  } catch {
    return null;
  }
}

/** Run the purchase flow. Returns the plan if the user now owns the unlock. */
export async function purchaseUnlock(): Promise<Plan | null> {
  const { state } = await Unlock.purchase();
  if (state !== 'purchased') return null;
  const plan = lifetimePlan();
  savePlan(plan);
  return plan;
}

/** Restore a previous purchase (new device, reinstall). */
export async function restoreUnlock(): Promise<Plan | null> {
  const { owned } = await Unlock.restore();
  if (!owned) return null;
  const plan = lifetimePlan();
  savePlan(plan);
  return plan;
}

/**
 * Boot-time reconcile: if StoreKit says the unlock is owned but the local
 * plan is free (fresh install, restored backup), grant it silently.
 */
export async function reconcileEntitlement(): Promise<Plan | null> {
  if (!isNative || loadPlan().tier === 'paid') return null;
  try {
    const { owned } = await Unlock.isOwned();
    if (!owned) return null;
    const plan = lifetimePlan();
    savePlan(plan);
    return plan;
  } catch {
    return null;
  }
}
