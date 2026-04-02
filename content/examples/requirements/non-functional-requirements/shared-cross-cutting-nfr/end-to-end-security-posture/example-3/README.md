# Example 3 — Signing key rotation for session/JWT-like tokens

## What it shows
- A minimal token format with `kid` and HMAC signatures.
- A safe rotation playbook:
  1) **Add** new key and start signing with it.
  2) Keep old key for **verification overlap**.
  3) **Remove** old key after the max TTL.
- Expiry is enforced independently of rotation.

## Run
```bash
pnpm install
pnpm demo
```

## Files
- `src/signer.ts` (sign/verify with key set)
- `src/demo.ts` (rotation simulation + assertions)

