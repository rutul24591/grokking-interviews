## Why encryption at rest isn’t enough

Encrypting client data can reduce risk if disk/backup is compromised, but:
- JS still needs the key to decrypt
- key management becomes the hard part
- XSS can still steal plaintext after decryption

Use this for protecting local offline data, not as a replacement for server-side trust boundaries.

