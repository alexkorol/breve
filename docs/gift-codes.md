# "I met my goal" gift codes: how to operate it

The program: a user with real usage (30-day streak or 500+ reviews) sees an
"I met my goal" section in Settings. Submitting a testimonial (via email for
now) earns 12 one-month full-access codes to hand to friends. Deliberately NOT
tied to App Store reviews: incentivized reviews are prohibited by Apple. The
app shows codes and redemption everywhere; only minting needs the private key.

## Manual fulfillment (until the backend exists)

1. A testimonial lands at the address in `TESTIMONIAL_EMAIL` (src/components/Settings.tsx).
2. Mint codes: `node tools/mint-gift-codes.mjs ~/Code/jimothy-keys 12`
3. Email the 12 codes back. Done.

The private key lives at `~/Code/jimothy-keys/gift-signing-key.pem` (never in
the repo; back it up). The matching public key is embedded in
`src/giftcodes.ts` as `PUBLIC_KEY_JWK`. Losing the private key means minting
stops working until you rotate the key pair (`--init` again, update the JWK,
ship an app update; old codes die with the old key).

## How codes work

`JIM1.<base64url payload>.<base64url ECDSA-P256 signature>`; payload is
`{"id":"<12 hex>","k":"month1"}`. The app verifies the signature offline with
WebCrypto, so redemption needs no network. Redeeming starts a 30-day paid
plan (`membership.ts`, `expiresAt` set). Single-use is enforced per device
only (redeemed ids in the `breve:redeemedCodes` setting): good enough while
codes are handed out one email at a time.

## When the backend ships

Move the signing key and mint logic from tools/mint-gift-codes.mjs into the
worker; add a testimonial intake endpoint so submission stops being mailto;
add server-side redemption logging for global single-use. The app-side format
and verification can stay exactly as they are.
