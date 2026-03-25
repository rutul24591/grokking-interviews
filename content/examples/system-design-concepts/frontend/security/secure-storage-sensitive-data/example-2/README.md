## Secure Storage — Example 2: Encrypt data at rest (WebCrypto AES-GCM)

This Node.js example uses `crypto.webcrypto.subtle` to:
- derive a key from a passphrase (PBKDF2)
- encrypt/decrypt with AES-GCM

### Run
```bash
pnpm i
pnpm start
```

