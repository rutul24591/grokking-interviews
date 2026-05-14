"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-web3-wallet-frontend",
  title: "Design a Web3 Wallet Frontend (like MetaMask)",
  description:
    "Architecture for a Web3 wallet frontend: HD wallet key derivation (BIP-39 mnemonic, BIP-44 derivation path), secure key storage in browser extension secure storage, transaction signing flow with EIP-712 typed data display, gas estimation and fee priority selection, dApp connection management (EIP-1193 provider injection), multi-chain support with network switching, token balance aggregation with real-time price feeds, phishing site detection, transaction history from block explorer APIs, and hardware wallet integration via WebHID.",
  category: "high-level-design",
  subcategory: "emerging-future-systems",
  slug: "web3-wallet-frontend",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-14",
  tags: ["hld", "web3", "wallet", "metamask", "bip39", "eip1193", "transaction-signing", "hd-wallet"],
  relatedTopics: ["ar-vr-interface-system", "voice-based-ui-system"],
};

export default function Web3WalletFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A Web3 wallet is the most security-critical piece of software a user interacts with in the blockchain ecosystem. Unlike a regular app, a wallet holds cryptographic private keys that give complete, irrevocable control over user funds. A single exploit — a phishing site tricking the user into signing a malicious transaction, or a key extraction vulnerability in storage — results in permanent, unrecoverable financial loss. The design must treat security as the primary constraint, not an afterthought.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The wallet also serves as the identity and authentication layer for the decentralized web: dApps (decentralized applications) connect to the wallet via a standardized provider API (EIP-1193) to request signatures and transactions. The wallet is therefore both a key management system and a middleware layer between dApps and the blockchain. The UX must make complex cryptographic operations (gas estimation, typed data signing, multi-chain switching) understandable to non-technical users while never hiding the security implications of what is being signed.</HighlightBlock>
        <p><strong>Explicit scope:</strong> HD wallet key derivation, secure key storage, transaction signing UI, dApp connection (EIP-1193), gas estimation, multi-chain support, token balances, phishing detection, and hardware wallet integration. Not in scope: NFT minting, DeFi protocol integration, or cross-chain bridges.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>HD wallet key derivation (BIP-39/BIP-44):</strong> Wallet creation generates a 12 or 24-word BIP-39 mnemonic phrase (128 or 256 bits of entropy from a CSPRNG). The mnemonic is converted to a 512-bit seed via PBKDF2-HMAC-SHA512 with 2048 iterations and an optional passphrase. From the seed, a BIP-32 hierarchical deterministic (HD) wallet tree is derived. The default derivation path for Ethereum is m/44'/60'/0'/0/N where N is the account index. This allows generating unlimited accounts from a single mnemonic, and recovering all accounts from the mnemonic alone. The private key for each account is the leaf node of the derivation tree.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Secure key storage in browser extension:</strong> Private keys are never stored in plaintext. The storage model: the mnemonic (or individual private keys for imported accounts) is encrypted with AES-256-GCM using a key derived from the user's wallet password via PBKDF2-HMAC-SHA256 (600,000 iterations, per OWASP recommendation). The encrypted vault is stored in chrome.storage.local (not localStorage — extension storage is sandboxed from web pages). On wallet unlock, the user provides the password, the vault is decrypted in memory, and the decrypted keys are held in a locked memory buffer (zeroed on wallet lock or after 15 minutes of inactivity). Keys are never written to disk after decryption — only the encrypted vault persists.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Transaction signing flow with EIP-712 typed data:</strong> When a dApp requests a signature, the wallet popup shows: (1) the requesting dApp origin (highlighted in red if it's a known phishing site or if the domain doesn't match the connected site); (2) the transaction details decoded from the ABI — not raw hex; (3) for EIP-712 typed data signatures (used by Permit, Seaport, etc.), the structured data is decoded and displayed field-by-field with human-readable labels. The user sees "Approve USDC spending: 1,000 USDC to Uniswap Router" not "data: 0x095ea7b3...". The signing operation is performed in the extension background context (not the content script) to prevent dApps from intercepting the signed result before it's returned.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Gas estimation and EIP-1559 fee selection:</strong> For each transaction, the wallet fetches gas estimates from the connected RPC node (eth_estimateGas) and the current base fee + priority fee suggestions (eth_feeHistory). Three preset fee tiers are offered: Slow (&lt;10th percentile priority fee, lower cost), Standard (50th percentile), and Fast (&gt;90th percentile priority fee, higher cost but faster inclusion). The estimated confirmation time is shown per tier (derived from historical block data). Advanced users can set custom maxFeePerGas and maxPriorityFeePerGas. Gas limit is set to estimatedGas × 1.2 (safety buffer). If the estimated transaction cost exceeds the user's ETH balance, the "Confirm" button is disabled with an error: "Insufficient ETH for gas."</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>EIP-1193 dApp connection (provider injection):</strong> The wallet injects a window.ethereum provider object into every web page via a content script. The content script bridges postMessage communication between the page and the extension background. dApps call window.ethereum.request(&#123;method: 'eth_requestAccounts'&#125;) to connect — this triggers a popup asking the user to approve the connection. Once approved, the dApp can call read methods (eth_accounts, eth_chainId, eth_getBalance) without further prompts. Write methods (eth_sendTransaction, eth_sign, personal_sign) always require user approval in the popup. The approved connection list is stored in the vault and shown in the "Connected Sites" settings page, where users can revoke individual dApp connections.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Multi-chain support with network switching:</strong> The wallet maintains a list of supported networks (Ethereum mainnet, Arbitrum, Optimism, Base, Polygon, and user-added custom RPC networks). Each network has its own RPC URL, chainId, native token symbol, and block explorer URL. The active network is shown in the header. dApps can request a network switch via wallet_switchEthereumChain (EIP-3326) — the wallet prompts the user to confirm. Custom networks added by dApps via wallet_addEthereumChain are shown with a warning ("This is a custom network added by a dApp — verify the RPC URL before proceeding"). All RPC calls (balance fetches, gas estimates) use the active network's RPC endpoint.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Phishing site detection:</strong> Every time a dApp requests a connection or signature, the requesting origin is checked against a phishing blocklist (EthPhishing, MetaMask's phishing detector). The blocklist is fetched from a CDN-hosted JSON file at wallet startup and cached locally (refreshed every 30 minutes). If the origin matches the blocklist, the transaction popup shows a full-screen red warning: "This site has been reported as a phishing site. Do NOT proceed." The transaction cannot be approved — only dismissed. Additionally, homoglyph detection checks for visually similar domain names (e.g., "rnетamask.io" using Cyrillic characters) that impersonate trusted dApps.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Hardware wallet integration via WebHID:</strong> The wallet supports Ledger and Trezor hardware wallets via WebHID (Chrome) and WebUSB. Hardware wallet accounts are added by connecting the device, opening the Ethereum app on the device, and deriving addresses (the wallet reads the public keys from the device — private keys never leave the hardware wallet). Transaction signing: the unsigned transaction is sent to the hardware wallet device via HID, the user confirms on the device's physical screen (showing the recipient address and amount), and the device returns the signed transaction. The private key never touches the host computer.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">A browser extension wallet has three execution contexts: the background service worker (persistent, holds the decrypted key vault in memory when unlocked, processes signing requests), the content script (injected into every web page, bridges window.ethereum provider calls to the background via chrome.runtime.sendMessage), and the popup UI (the React app shown when the user clicks the extension icon or when a dApp triggers a signing request). These contexts communicate via Chrome extension message passing (chrome.runtime.sendMessage / chrome.runtime.onMessage).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The popup UI is a React app with Zustand for state management. It reads wallet state from the background via an init message on load and subscribes to state updates via chrome.runtime.onMessage. The UI never holds private keys — it only receives derived data (addresses, balances, pending transaction details for display). All cryptographic operations (signing, key derivation) happen exclusively in the background service worker.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/emerging-future-systems/web3-wallet-frontend.svg"
          alt="Web3 wallet frontend architecture: BIP-39 mnemonic → PBKDF2 seed → BIP-44 HD derivation (m/44'/60'/0'/0/N) → private key; AES-256-GCM encrypted vault in chrome.storage.local; content script injects window.ethereum EIP-1193 provider; background worker holds decrypted keys in memory (zeroed on lock/15min); dApp request → phishing blocklist check → popup shows decoded ABI + EIP-712 typed data → user approves → background signs → returns to dApp; gas estimation from eth_estimateGas + eth_feeHistory (Slow/Standard/Fast tiers); hardware wallet via WebHID."
          caption="BIP-39/BIP-44 HD derivation, AES-256-GCM vault (PBKDF2 600K iterations), EIP-1193 provider injection, phishing blocklist check, EIP-712 decoded display, EIP-1559 fee tiers (Slow/Standard/Fast), WebHID hardware wallet (key never leaves device)"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Key Vault Encryption and Memory Safety</h3>
        <HighlightBlock as="p" tier="important">The vault encryption uses the Web Crypto API (not a third-party library) for AES-256-GCM. Key derivation: const key = await crypto.subtle.importKey('raw', passwordBytes, &#123;name: 'PBKDF2'&#125;, false, ['deriveKey']); const aesKey = await crypto.subtle.deriveKey(&#123;name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256'&#125;, key, &#123;name: 'AES-GCM', length: 256&#125;, false, ['encrypt', 'decrypt']). The salt is a random 16-byte value stored alongside the encrypted vault. The AES-GCM IV (initialization vector) is a random 12-byte value, unique per encryption operation, also stored with the ciphertext.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Memory safety: JavaScript does not have a secure memory primitive (no equivalent of SecureString in C#). The decrypted keys are held as Uint8Array buffers. On lock, the buffer contents are overwritten: keyBuffer.fill(0). This is a best-effort zero — the JavaScript engine may have already copied the buffer during garbage collection. For production wallets, the background service worker should be restarted on lock to ensure the process memory is cleared. Chrome's Manifest V3 service workers terminate after inactivity, providing a natural memory clearing mechanism.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Transaction Simulation and Risk Scoring</h3>
        <HighlightBlock as="p" tier="important">Before displaying a transaction for user approval, the wallet simulates the transaction (using eth_call with the transaction payload against the current state) to predict the outcome: token balance changes, contract interactions, and potential failure. The simulation result is shown as a preview: "+1,000 USDC, -0.5 ETH" (token in/out visualization). If the simulation shows the transaction will fail (reverted), a warning is shown: "This transaction is likely to fail — you will still pay gas." Risk scoring: unlimited token approvals (approve(spender, type(uint256).max)) are flagged as high-risk with a warning: "This grants unlimited spending access. Consider approving only the amount needed." Contract interactions with unverified code (no source on Etherscan) also trigger a warning.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Token Balance Aggregation</h3>
        <HighlightBlock as="p" tier="important">The wallet fetches token balances using: (1) native ETH balance via eth_getBalance; (2) ERC-20 token balances via a multicall contract (Multicall3) — batching hundreds of balanceOf calls into a single RPC call to avoid rate limiting; (3) known token list from the active network's token registry (e.g., Uniswap token list). Token prices are fetched from a price feed API (CoinGecko, Chainlink price feeds) and used to compute USD balances. The balance list is cached in memory and refreshed every 60 seconds (or on each new block via an eth_subscribe newHeads WebSocket subscription, for near-real-time updates without polling).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Transaction History</h3>
        <HighlightBlock as="p" tier="important">Transaction history is fetched from a block explorer API (Etherscan, Alchemy Enhanced APIs) rather than scanning the blockchain directly. The API provides: list of transactions by address, decoded function calls (method name, parameters), ERC-20 transfer events, and confirmation status. The history is paginated and cached locally. Pending transactions (submitted but not yet mined) are tracked in local storage with their nonce — if a transaction is pending for &gt;5 minutes, the wallet offers a "Speed Up" option (resubmit with a higher priority fee, same nonce — replaces the stuck transaction) or "Cancel" (send a 0-value self-transaction with the same nonce but higher fee, to replace with a no-op).</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">Extension vs. mobile app vs. web wallet: browser extensions have access to page context (content script injection), making them the most capable platform for dApp interaction. Mobile wallets use deep links (WalletConnect protocol) to connect to dApps running in a mobile browser — more friction but better security isolation (the wallet and dApp run in separate apps). Web wallets (iframe-based, like Coinbase Wallet SDK) eliminate the extension requirement but reduce security by running key operations in a browser tab that could be compromised by XSS on the host page. For a MetaMask-equivalent, the browser extension is the right architecture.</HighlightBlock>
        <HighlightBlock as="p" tier="important">RPC provider centralization: by default, wallets use a single RPC provider (Infura, Alchemy). This creates a privacy and availability risk — the RPC provider sees every address queried and every transaction submitted. Privacy-preserving alternatives: run a local Ethereum node (impractical for most users), use privacy-preserving RPC proxies (RPCh, which routes requests through a mixnet), or rotate between multiple RPC providers. The wallet should allow users to configure their own RPC URL for each network.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">A Web3 wallet frontend requires: (1) HD wallet key derivation (BIP-39 mnemonic → PBKDF2 seed → BIP-44 path m/44'/60'/0'/0/N, unlimited accounts from one mnemonic); (2) AES-256-GCM encrypted vault in chrome.storage.local (PBKDF2-SHA256 600K iterations, random salt + IV, key zeroed on lock); (3) three-context extension architecture (background worker holds keys, content script bridges provider, popup UI for user interaction); (4) EIP-1193 provider injection (window.ethereum, connection approval, read-without-prompt / write-always-prompt); (5) EIP-712 typed data decoded display (ABI decoding, structured field labels, not raw hex); (6) EIP-1559 fee tiers (eth_feeHistory, Slow/Standard/Fast with confirmation time estimates); (7) transaction simulation (eth_call preview: token in/out visualization, unlimited approval warning, unverified contract warning); (8) phishing detection (blocklist CDN-cached 30min, homoglyph detection); (9) Multicall3 token balance aggregation (batch balanceOf, real-time via eth_subscribe newHeads); and (10) WebHID hardware wallet (Ledger/Trezor, unsigned tx to device, user confirms on device screen, signed tx returned, private key never leaves device). The core security invariant: private keys exist in decrypted form only in the background worker's memory, never in content scripts, popup UI, or persistent storage.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
