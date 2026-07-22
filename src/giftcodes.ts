import { getSetting, setSetting } from './storage';
import { savePlan, type Plan } from './membership';

/**
 * Gift codes for the "I met my goal" program: ECDSA P-256 signed tokens
 * verified fully offline, so redemption works without a backend. Codes are
 * minted by tools/mint-gift-codes.mjs (manual fulfillment for now; the same
 * logic moves into the backend worker later).
 *
 * Format: JIM1.<base64url payload>.<base64url signature>
 * Payload: {"id":"<12 hex>","k":"month1"}
 *
 * Single-use is enforced per device only until the backend exists; the code
 * id list lives in settings under "redeemedCodes".
 */

/** Public half of the signing key; the private key never ships. */
const PUBLIC_KEY_JWK = {
  kty: 'EC',
  x: '_ayNwAk-EW_Kz6gL_wj5j8L4on3HCHJb2PrICqImO2k',
  y: 'QSCqAswEGW2D95k63h6DAlBBpc0eo7lnzkXvOmmi_iw',
  crv: 'P-256',
} as const;

const GIFT_DAYS = 30;

function b64urlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function verifySignature(payload: Uint8Array, sig: Uint8Array): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'jwk',
      PUBLIC_KEY_JWK,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify'],
    );
    return await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      key,
      sig as BufferSource,
      payload as BufferSource,
    );
  } catch {
    return false;
  }
}

function redeemedIds(): string[] {
  try {
    const raw = getSetting('redeemedCodes');
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export type RedeemResult =
  | { ok: true; plan: Plan }
  | { ok: false; reason: 'invalid' | 'already-used' };

/** Validate a gift code and, if good, start a 30-day full-access plan. */
export async function redeemGiftCode(input: string): Promise<RedeemResult> {
  const trimmed = input.trim();
  const parts = trimmed.split('.');
  if (parts.length !== 3 || parts[0] !== 'JIM1') return { ok: false, reason: 'invalid' };

  let payloadBytes: Uint8Array;
  let sigBytes: Uint8Array;
  let payload: { id?: unknown; k?: unknown };
  try {
    payloadBytes = b64urlToBytes(parts[1]);
    sigBytes = b64urlToBytes(parts[2]);
    payload = JSON.parse(new TextDecoder().decode(payloadBytes));
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (typeof payload.id !== 'string' || payload.k !== 'month1') {
    return { ok: false, reason: 'invalid' };
  }
  if (!(await verifySignature(payloadBytes, sigBytes))) return { ok: false, reason: 'invalid' };

  const used = redeemedIds();
  if (used.includes(payload.id)) return { ok: false, reason: 'already-used' };
  setSetting('redeemedCodes', JSON.stringify([...used, payload.id]));

  const plan: Plan = { tier: 'paid', expiresAt: Date.now() + GIFT_DAYS * 86400000 };
  savePlan(plan);
  return { ok: true, plan };
}
