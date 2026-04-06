/**
 * Chat/Messaging — Staff-Level Message Encryption.
 *
 * Staff differentiator: End-to-end encryption with Signal Protocol pattern,
 * forward secrecy, and server-side message storage of encrypted blobs only.
 */

/**
 * Simulates end-to-end encryption for chat messages.
 * In production, use the Signal Protocol (libsignal) or MLS (Messaging Layer Security).
 */
export class EndToEndEncryption {
  private keyPair: CryptoKeyPair | null = null;

  /**
   * Generates a key pair for E2E encryption.
   */
  async initialize(): Promise<void> {
    this.keyPair = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey', 'deriveBits'],
    );
  }

  /**
   * Exports the public key for sharing with other users.
   */
  async exportPublicKey(): Promise<string> {
    if (!this.keyPair) throw new Error('Not initialized');
    const exported = await crypto.subtle.exportKey('spki', this.keyPair.publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  /**
   * Encrypts a message for a specific recipient.
   */
  async encryptMessage(
    plaintext: string,
    recipientPublicKey: string,
  ): Promise<{ ciphertext: string; iv: string }> {
    if (!this.keyPair) throw new Error('Not initialized');

    // Import recipient's public key
    const binaryKey = Uint8Array.from(atob(recipientPublicKey), (c) => c.charCodeAt(0));
    const recipientKey = await crypto.subtle.importKey(
      'spki',
      binaryKey,
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      [],
    );

    // Derive shared secret
    const sharedBits = await crypto.subtle.deriveBits(
      { name: 'ECDH', public: recipientKey },
      this.keyPair.privateKey,
      256,
    );

    // Derive AES-GCM key from shared secret
    const aesKey = await crypto.subtle.importKey(
      'raw',
      sharedBits,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt'],
    );

    // Encrypt
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      new TextEncoder().encode(plaintext),
    );

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
      iv: btoa(String.fromCharCode(...iv)),
    };
  }

  /**
   * Decrypts a received message.
   */
  async decryptMessage(
    ciphertext: string,
    iv: string,
    senderPublicKey: string,
  ): Promise<string> {
    if (!this.keyPair) throw new Error('Not initialized');

    // Import sender's public key and derive shared secret
    const binaryKey = Uint8Array.from(atob(senderPublicKey), (c) => c.charCodeAt(0));
    const senderKey = await crypto.subtle.importKey(
      'spki',
      binaryKey,
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      [],
    );

    const sharedBits = await crypto.subtle.deriveBits(
      { name: 'ECDH', public: senderKey },
      this.keyPair.privateKey,
      256,
    );

    const aesKey = await crypto.subtle.importKey(
      'raw',
      sharedBits,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );

    const binaryCiphertext = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
    const binaryIv = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: binaryIv },
      aesKey,
      binaryCiphertext,
    );

    return new TextDecoder().decode(decrypted);
  }
}
