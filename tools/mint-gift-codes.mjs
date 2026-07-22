#!/usr/bin/env node
/**
 * Gift-code minting for the "I met my goal" program.
 *
 * Codes are ECDSA P-256 signed tokens the app verifies offline against the
 * public key embedded in src/giftcodes.ts. The private key must NEVER enter
 * the repo. Until the backend exists, fulfillment is manual: run this script
 * when a testimonial arrives and email the codes back.
 *
 * Usage:
 *   node tools/mint-gift-codes.mjs --init <keydir>     # one-time keypair setup
 *   node tools/mint-gift-codes.mjs <keydir> [count]    # mint codes (default 12)
 *
 * --init prints the public JWK: paste it into PUBLIC_KEY_JWK in
 * src/giftcodes.ts. Port this same logic into the backend worker later.
 */
import { generateKeyPairSync, createPrivateKey, sign, randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const b64url = (buf) => Buffer.from(buf).toString('base64url');

const args = process.argv.slice(2);
if (args[0] === '--init') {
  const dir = args[1];
  if (!dir) {
    console.error('Usage: mint-gift-codes.mjs --init <keydir>');
    process.exit(1);
  }
  mkdirSync(dir, { recursive: true });
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  writeFileSync(join(dir, 'gift-signing-key.pem'), privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
  const jwk = publicKey.export({ format: 'jwk' });
  writeFileSync(join(dir, 'gift-public-key.jwk.json'), JSON.stringify(jwk, null, 2));
  console.log('Private key written to', join(dir, 'gift-signing-key.pem'), '(keep out of the repo)');
  console.log('\nPaste this into PUBLIC_KEY_JWK in src/giftcodes.ts:\n');
  console.log(JSON.stringify(jwk));
  process.exit(0);
}

const dir = args[0];
if (!dir) {
  console.error('Usage: mint-gift-codes.mjs <keydir> [count]');
  process.exit(1);
}
const count = Number(args[1] ?? 12);
const key = createPrivateKey(readFileSync(join(dir, 'gift-signing-key.pem')));

for (let i = 0; i < count; i++) {
  const payload = JSON.stringify({ id: randomBytes(6).toString('hex'), k: 'month1' });
  const sig = sign('sha256', Buffer.from(payload), { key, dsaEncoding: 'ieee-p1363' });
  console.log(`JIM1.${b64url(payload)}.${b64url(sig)}`);
}
