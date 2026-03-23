#!/usr/bin/env node
/**
 * Generate Detailed Identity & Access Diagrams
 * Batch 4: MFA & Password (12 diagrams)
 */

import * as fs from "fs";
import * as path from "path";

const DIR = "public/diagrams/requirements/functional-requirements/identity-access";

const C = {
  bg: "#ffffff",
  panel: "#f1f5f9",
  panel2: "#f8fafc",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#0f172a",
  textMuted: "#475569",
  border: "#e2e8f0",
};

function svg(content: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${C.textMuted}"/>
    </marker>
  </defs>
  <rect width="800" height="500" fill="${C.bg}"/>
  ${content}
</svg>`;
}

// 1. MFA Setup Flow
fs.writeFileSync(path.join(DIR, "mfa-setup-flow.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">MFA Setup Flow</text>
  
  <!-- User -->
  <circle cx="80" cy="100" r="35" fill="${C.primary}"/>
  <text x="80" y="105" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">User</text>
  
  <!-- Security Settings -->
  <rect x="180" y="70" width="140" height="60" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="250" y="105" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Security Settings</text>
  
  <!-- MFA Options -->
  <rect x="370" y="60" width="180" height="80" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="460" y="85" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">MFA Methods</text>
  <text x="460" y="110" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">TOTP, SMS, Email, WebAuthn</text>
  
  <!-- QR Code -->
  <rect x="600" y="70" width="100" height="100" rx="8" fill="${C.bg}" stroke="${C.border}" stroke-width="2"/>
  <text x="650" y="95" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">QR Code</text>
  <rect x="615" y="105" width="70" height="50" fill="${C.panel2}"/>
  <text x="650" y="135" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">Secret Key</text>
  
  <!-- Arrows -->
  <line x1="115" y1="100" x2="170" y2="100" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="142" y="90" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">1. Navigate</text>
  
  <line x1="320" y1="100" x2="360" y2="100" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="340" y="90" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">2. Select method</text>
  
  <line x1="550" y1="100" x2="590" y2="100" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="570" y="90" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">3. Generate QR</text>
  
  <!-- Verification Steps -->
  <rect x="180" y="180" width="440" height="140" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="205" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Verification Steps</text>
  
  <rect x="200" y="225" width="120" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="260" y="247" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Scan QR Code</text>
  
  <rect x="340" y="225" width="120" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="247" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Enter Code</text>
  
  <rect x="480" y="225" width="120" height="35" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="540" y="247" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Verify</text>
  
  <line x1="320" y1="242" x2="335" y2="242" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="460" y1="242" x2="475" y2="242" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <rect x="200" y="275" width="400" height="35" rx="4" fill="${C.panel}"/>
  <text x="400" y="297" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Save Backup Codes (Download/Print)</text>
  
  <!-- MFA Methods -->
  <rect x="50" y="350" width="160" height="120" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="130" y="375" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">TOTP App</text>
  <text x="130" y="400" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Google Authenticator</text>
  <text x="130" y="415" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Authy, 1Password</text>
  <text x="130" y="435" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Most secure</text>
  
  <rect x="230" y="350" width="160" height="120" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="310" y="375" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">SMS</text>
  <text x="310" y="400" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Text message code</text>
  <text x="310" y="420" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.warning}">⚠ SIM swapping</text>
  <text x="310" y="435" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Wide adoption</text>
  
  <rect x="410" y="350" width="160" height="120" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="490" y="375" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Email</text>
  <text x="490" y="400" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Magic link or code</text>
  <text x="490" y="420" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.warning}">⚠ Email compromise</text>
  <text x="490" y="435" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Fallback option</text>
  
  <rect x="590" y="350" width="160" height="120" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="670" y="375" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">WebAuthn</text>
  <text x="670" y="400" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">FIDO2, Touch ID</text>
  <text x="670" y="420" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Face ID, YubiKey</text>
  <text x="670" y="440" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Phishing resistant</text>
`));

// 2. MFA Methods
fs.writeFileSync(path.join(DIR, "mfa-methods.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">MFA Authentication Methods</text>
  
  <!-- Knowledge Factor -->
  <rect x="50" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="160" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Knowledge Factor</text>
  <text x="160" y="115" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Something you know</text>
  
  <rect x="70" y="130" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="160" y="152" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Password / PIN</text>
  
  <rect x="70" y="170" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="160" y="192" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Security Questions</text>
  
  <rect x="70" y="210" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="160" y="232" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Pattern Lock</text>
  
  <text x="160" y="260" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.danger}">✗ Weakest factor</text>
  
  <!-- Possession Factor -->
  <rect x="290" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.secondary}" stroke-width="2"/>
  <text x="400" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Possession Factor</text>
  <text x="400" y="115" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Something you have</text>
  
  <rect x="310" y="130" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="152" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">SMS / Voice Call</text>
  
  <rect x="310" y="170" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="192" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Authenticator App (TOTP)</text>
  
  <rect x="310" y="210" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="232" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Hardware Token (YubiKey)</text>
  
  <text x="400" y="260" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Strong factor</text>
  
  <!-- Inherence Factor -->
  <rect x="530" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.success}" stroke-width="2"/>
  <text x="640" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Inherence Factor</text>
  <text x="640" y="115" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Something you are</text>
  
  <rect x="550" y="130" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="640" y="152" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Fingerprint</text>
  
  <rect x="550" y="170" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="640" y="192" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Face Recognition</text>
  
  <rect x="550" y="210" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="640" y="232" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Iris / Retina Scan</text>
  
  <text x="640" y="260" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Strongest factor</text>
  
  <!-- Location/Time -->
  <rect x="50" y="280" width="340" height="170" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="305" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Contextual Factors (Adaptive MFA)</text>
  
  <rect x="70" y="325" width="130" height="40" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="135" y="345" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Geolocation</text>
  <text x="135" y="360" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">IP, GPS</text>
  
  <rect x="220" y="325" width="130" height="40" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="285" y="345" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Time of Day</text>
  <text x="285" y="360" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">Business hours</text>
  
  <rect x="70" y="375" width="130" height="40" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="135" y="395" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Device Fingerprint</text>
  <text x="135" y="410" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">Known device</text>
  
  <rect x="220" y="375" width="130" height="40" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="285" y="395" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Behavior Analysis</text>
  <text x="285" y="410" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">Typing pattern</text>
  
  <!-- Security Ranking -->
  <rect x="420" y="280" width="330" height="170" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="585" y="305" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Security Strength Ranking</text>
  
  <rect x="440" y="325" width="290" height="30" rx="4" fill="${C.success}"/>
  <text x="585" y="345" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">1. WebAuthn / FIDO2 (Phishing-resistant)</text>
  
  <rect x="440" y="360" width="290" height="30" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="585" y="380" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">2. TOTP Authenticator App</text>
  
  <rect x="440" y="395" width="290" height="30" rx="4" fill="${C.warning}"/>
  <text x="585" y="415" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">3. SMS / Voice (Vulnerable to SIM swap)</text>
  
  <rect x="440" y="430" width="290" height="20" rx="4" fill="${C.danger}" opacity="0.5"/>
  <text x="585" y="445" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">4. Email (Weakest, not recommended)</text>
`));

// 3. MFA Recovery
fs.writeFileSync(path.join(DIR, "mfa-recovery.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">MFA Recovery &amp; Backup Options</text>
  
  <!-- Lost Access -->
  <rect x="50" y="70" width="140" height="100" rx="8" fill="${C.danger}"/>
  <text x="120" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.bg}">Lost Access</text>
  <text x="120" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Lost phone</text>
  <text x="120" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Deleted app</text>
  <text x="120" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Broken token</text>
  
  <line x1="190" y1="120" x2="230" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Recovery Options -->
  <rect x="240" y="60" width="320" height="120" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="400" y="85" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Recovery Options</text>
  
  <rect x="260" y="100" width="130" height="35" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="325" y="122" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Backup Codes</text>
  
  <rect x="410" y="100" width="130" height="35" rx="4" fill="${C.primary}" opacity="0.8"/>
  <text x="475" y="122" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Recovery Email</text>
  
  <rect x="260" y="140" width="130" height="35" rx="4" fill="${C.secondary}" opacity="0.8"/>
  <text x="325" y="162" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Recovery Phone</text>
  
  <rect x="410" y="140" width="130" height="35" rx="4" fill="${C.warning}" opacity="0.8"/>
  <text x="475" y="162" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Support Ticket</text>
  
  <line x1="560" y1="120" x2="600" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Verification -->
  <rect x="610" y="70" width="140" height="100" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="680" y="95" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Verify Identity</text>
  <text x="680" y="120" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Security questions</text>
  <text x="680" y="135" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">ID verification</text>
  <text x="680" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Manager approval</text>
  
  <line x1="680" y1="170" x2="680" y2="200" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Reset MFA -->
  <rect x="610" y="210" width="140" height="80" rx="8" fill="${C.success}"/>
  <text x="680" y="240" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.bg}">Reset MFA</text>
  <text x="680" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Generate new secret</text>
  <text x="680" y="280" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Invalidate old</text>
  
  <!-- Backup Codes -->
  <rect x="50" y="210" width="340" height="240" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="240" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Backup Codes (Recommended)</text>
  
  <rect x="70" y="260" width="300" height="80" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="220" y="285" text-anchor="middle" font-family="monospace" font-size="10" fill="${C.textMuted}">ABCD-1234    EFGH-5678    IJKL-9012</text>
  <text x="220" y="305" text-anchor="middle" font-family="monospace" font-size="10" fill="${C.textMuted}">MNOP-3456    QRST-7890    UVWX-1234</text>
  <text x="220" y="325" text-anchor="middle" font-family="monospace" font-size="10" fill="${C.textMuted}">YZAB-5678    CDEF-9012    GHIJ-3456</text>
  
  <text x="220" y="360" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.success}">✓ 10-20 single-use codes</text>
  <text x="220" y="380" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.success}">✓ Download or print</text>
  <text x="220" y="400" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.success}">✓ Store securely offline</text>
  <text x="220" y="420" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.success}">✓ One code = one login</text>
  <text x="220" y="440" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.warning}">⚠ Cannot be regenerated</text>
  
  <!-- Best Practices -->
  <rect x="420" y="210" width="330" height="240" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="585" y="240" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Recovery Best Practices</text>
  
  <rect x="440" y="260" width="290" height="35" rx="4" fill="${C.panel}"/>
  <text x="585" y="282" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Multiple recovery methods</text>
  <text x="710" y="282" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.success}">✓ Recommended</text>
  
  <rect x="440" y="300" width="290" height="35" rx="4" fill="${C.panel}"/>
  <text x="585" y="322" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Trusted contacts (enterprise)</text>
  <text x="710" y="322" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.success}">✓ Recommended</text>
  
  <rect x="440" y="340" width="290" height="35" rx="4" fill="${C.panel}"/>
  <text x="585" y="362" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Hardware security key backup</text>
  <text x="710" y="362" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.success}">✓ Recommended</text>
  
  <rect x="440" y="380" width="290" height="35" rx="4" fill="${C.panel}"/>
  <text x="585" y="402" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Waiting period for changes</text>
  <text x="710" y="402" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.success}">✓ Security delay</text>
  
  <rect x="440" y="420" width="290" height="25" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="437" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">⚠ Notify user of all MFA changes</text>
`));

// 4. Password Hashing Flow
fs.writeFileSync(path.join(DIR, "password-hashing-flow.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Password Hashing &amp; Validation Flow</text>
  
  <!-- User Registration -->
  <rect x="50" y="70" width="140" height="100" rx="8" fill="${C.primary}"/>
  <text x="120" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.bg}">User Registration</text>
  <text x="120" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Choose password</text>
  <text x="120" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Password validation</text>
  <text x="120" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Strength check</text>
  
  <line x1="190" y1="120" x2="230" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="210" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">1. Plain text</text>
  
  <!-- Hashing Service -->
  <rect x="240" y="60" width="180" height="120" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="330" y="90" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Hashing Service</text>
  
  <rect x="260" y="110" width="140" height="30" rx="4" fill="${C.panel2}"/>
  <text x="330" y="130" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Generate Salt</text>
  <text x="330" y="145" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">16-32 bytes random</text>
  
  <rect x="260" y="150" width="140" height="30" rx="4" fill="${C.warning}" opacity="0.8"/>
  <text x="330" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">bcrypt / Argon2</text>
  
  <line x1="420" y1="120" x2="460" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="440" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">2. Hash</text>
  
  <!-- Storage -->
  <rect x="470" y="70" width="140" height="100" rx="8" fill="${C.panel}" stroke="${C.success}" stroke-width="2"/>
  <text x="540" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Database</text>
  <text x="540" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Store:</text>
  <text x="540" y="145" text-anchor="middle" font-family="monospace" font-size="8" fill="${C.textMuted}">hash + salt</text>
  <text x="540" y="160" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">NEVER plain text</text>
  
  <!-- Login Flow -->
  <rect x="50" y="220" width="140" height="100" rx="8" fill="${C.primary}"/>
  <text x="120" y="250" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.bg}">User Login</text>
  <text x="120" y="275" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Enter password</text>
  <text x="120" y="290" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Submit</text>
  <text x="120" y="305" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Rate limited</text>
  
  <line x1="190" y1="270" x2="230" y2="270" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="210" y="260" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">1. Plain text</text>
  
  <!-- Retrieve -->
  <rect x="240" y="210" width="180" height="120" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="330" y="240" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Retrieve Stored Hash</text>
  <text x="330" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Query by username</text>
  <text x="330" y="285" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Get hash + salt</text>
  <text x="330" y="305" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Constant time lookup</text>

  <line x1="420" y1="270" x2="460" y2="270" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Compare -->
  <rect x="470" y="210" width="180" height="120" rx="8" fill="${C.panel}" stroke="${C.danger}" stroke-width="2"/>
  <text x="560" y="240" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Constant-Time Compare</text>
  <text x="560" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Hash input password</text>
  <text x="560" y="285" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">With same salt</text>
  <text x="560" y="305" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">timing_safe_equals()</text>

  <line x1="650" y1="270" x2="690" y2="270" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Result -->
  <rect x="700" y="220" width="80" height="100" rx="8" fill="${C.success}"/>
  <text x="740" y="250" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">Match</text>
  <text x="740" y="275" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Allow</text>
  <text x="740" y="290" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Login</text>
  
  <rect x="700" y="330" width="80" height="60" rx="8" fill="${C.danger}"/>
  <text x="740" y="355" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">No Match</text>
  <text x="740" y="380" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Deny</text>
  
  <!-- Algorithms -->
  <rect x="50" y="360" width="340" height="110" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="385" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Recommended Algorithms</text>
  
  <rect x="70" y="400" width="120" height="35" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="130" y="422" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Argon2id</text>
  <text x="130" y="440" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.bg}">Best choice</text>
  
  <rect x="210" y="400" width="120" height="35" rx="4" fill="${C.success}" opacity="0.6"/>
  <text x="270" y="422" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">bcrypt</text>
  <text x="270" y="440" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.bg}">Good, proven</text>
  
  <rect x="70" y="445" width="120" height="35" rx="4" fill="${C.warning}" opacity="0.6"/>
  <text x="130" y="467" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">scrypt</text>
  <text x="130" y="485" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.text}">Memory-hard</text>
  
  <rect x="210" y="445" width="120" height="35" rx="4" fill="${C.danger}" opacity="0.3"/>
  <text x="270" y="467" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">PBKDF2</text>
  <text x="270" y="485" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.text}">Minimum acceptable</text>
  
  <!-- DON'T Use -->
  <rect x="420" y="360" width="330" height="110" rx="8" fill="${C.panel2}" stroke="${C.danger}" stroke-width="2"/>
  <text x="585" y="385" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.danger}">NEVER Use These</text>
  
  <rect x="440" y="405" width="290" height="25" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="422" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">MD5, SHA1, SHA256 (too fast)</text>
  
  <rect x="440" y="435" width="290" height="25" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="452" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Plain text storage</text>
  
  <rect x="440" y="465" width="290" height="25" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="482" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Reversible encryption</text>
`));

// 5. Password Validation
fs.writeFileSync(path.join(DIR, "password-validation.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Password Validation &amp; Policy</text>
  
  <!-- Input -->
  <rect x="50" y="70" width="140" height="100" rx="8" fill="${C.primary}"/>
  <text x="120" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.bg}">User Input</text>
  <text x="120" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">New password</text>
  <text x="120" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Confirm password</text>
  <text x="120" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Client-side check</text>
  
  <line x1="190" y1="120" x2="230" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Validation Rules -->
  <rect x="240" y="60" width="320" height="120" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="400" y="85" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Validation Rules</text>
  
  <rect x="260" y="100" width="130" height="35" rx="4" fill="${C.panel2}"/>
  <text x="325" y="122" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Min Length: 12</text>
  
  <rect x="410" y="100" width="130" height="35" rx="4" fill="${C.panel2}"/>
  <text x="475" y="122" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Max Length: 128</text>
  
  <rect x="260" y="140" width="130" height="35" rx="4" fill="${C.panel2}"/>
  <text x="325" y="162" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Uppercase (1+)</text>
  
  <rect x="410" y="140" width="130" height="35" rx="4" fill="${C.panel2}"/>
  <text x="475" y="162" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Lowercase (1+)</text>
  
  <rect x="260" y="180" width="130" height="35" rx="4" fill="${C.panel2}"/>
  <text x="325" y="202" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Number (1+)</text>
  
  <rect x="410" y="180" width="130" height="35" rx="4" fill="${C.panel2}"/>
  <text x="475" y="202" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Special char (1+)</text>
  
  <line x1="560" y1="120" x2="600" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Breach Check -->
  <rect x="610" y="70" width="140" height="100" rx="8" fill="${C.panel}" stroke="${C.danger}" stroke-width="2"/>
  <text x="680" y="95" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Breach Check</text>
  <text x="680" y="120" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Have I Been Pwned</text>
  <text x="680" y="135" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">k-anonymity</text>
  <text x="680" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">5-char prefix</text>
  <text x="680" y="165" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">API lookup</text>

  <!-- Password Strength -->
  <rect x="50" y="210" width="340" height="180" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="235" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Password Strength Meter</text>
  
  <!-- Weak -->
  <rect x="70" y="255" width="280" height="30" rx="4" fill="${C.danger}"/>
  <text x="210" y="275" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Weak</text>
  <text x="70" y="295" text-anchor="start" font-family="system-ui" font-size="9" fill="${C.textMuted}">&lt;8 chars, no complexity</text>
  
  <!-- Fair -->
  <rect x="70" y="310" width="280" height="30" rx="4" fill="${C.warning}"/>
  <text x="210" y="330" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Fair</text>
  <text x="70" y="350" text-anchor="start" font-family="system-ui" font-size="9" fill="${C.textMuted}">8-11 chars, basic complexity</text>
  
  <!-- Good -->
  <rect x="70" y="365" width="280" height="30" rx="4" fill="${C.success}" opacity="0.7"/>
  <text x="210" y="385" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Good</text>
  <text x="70" y="405" text-anchor="start" font-family="system-ui" font-size="9" fill="${C.textMuted}">12+ chars, full complexity</text>
  
  <!-- Strong -->
  <rect x="70" y="420" width="280" height="30" rx="4" fill="${C.success}"/>
  <text x="210" y="440" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Strong</text>
  <text x="70" y="460" text-anchor="start" font-family="system-ui" font-size="9" fill="${C.textMuted}">16+ chars, passphrase, unique</text>
  
  <!-- Common Passwords Block -->
  <rect x="420" y="210" width="330" height="180" rx="8" fill="${C.panel2}" stroke="${C.danger}" stroke-width="2"/>
  <text x="585" y="235" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Blocked Passwords</text>
  
  <rect x="440" y="255" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="275" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Common passwords (10,000+ list)</text>
  
  <rect x="440" y="290" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="310" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Dictionary words</text>
  
  <rect x="440" y="325" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="345" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Service name variations</text>
  
  <rect x="440" y="360" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="380" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Personal info (email, name)</text>
  
  <rect x="440" y="395" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="415" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Sequential patterns (12345, qwerty)</text>
  
  <!-- NIST Guidelines -->
  <rect x="420" y="410" width="330" height="60" rx="8" fill="${C.panel}" stroke="${C.success}" stroke-width="2"/>
  <text x="585" y="435" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">NIST 800-63B Guidelines</text>
  <text x="585" y="455" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Min 8 chars, max 64+ chars, no composition rules, check breach lists</text>
`));

// 6. Password Reset Flow
fs.writeFileSync(path.join(DIR, "password-reset-flow.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Password Reset Flow</text>
  
  <!-- Request -->
  <rect x="50" y="70" width="140" height="100" rx="8" fill="${C.primary}"/>
  <text x="120" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.bg}">Reset Request</text>
  <text x="120" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Enter email</text>
  <text x="120" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Submit</text>
  <text x="120" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Rate limit</text>
  
  <line x1="190" y1="120" x2="230" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="210" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">1. Email lookup</text>
  
  <!-- Token Generation -->
  <rect x="240" y="60" width="180" height="120" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="330" y="90" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Generate Token</text>
  
  <rect x="260" y="110" width="140" height="30" rx="4" fill="${C.panel2}"/>
  <text x="330" y="130" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Crypto random</text>
  <text x="330" y="145" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">32+ bytes</text>
  
  <rect x="260" y="150" width="140" height="30" rx="4" fill="${C.warning}" opacity="0.8"/>
  <text x="330" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Set expiry: 1 hour</text>
  
  <line x1="420" y1="120" x2="460" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="440" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">2. Store hash</text>
  
  <!-- Store -->
  <rect x="470" y="70" width="140" height="100" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="540" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Database</text>
  <text x="540" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Store token hash</text>
  <text x="540" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">NOT plain token</text>
  <text x="540" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">expires_at</text>
  
  <!-- Send Email -->
  <rect x="650" y="70" width="100" height="100" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="700" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Send Email</text>
  <text x="700" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Reset link</text>
  <text x="700" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Token in URL</text>
  <text x="700" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Single use</text>
  
  <line x1="700" y1="170" x2="700" y2="200" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Reset Form -->
  <rect x="630" y="210" width="140" height="100" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="700" y="240" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Reset Form</text>
  <text x="700" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Validate token</text>
  <text x="700" y="280" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">New password</text>
  <text x="700" y="295" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Confirm password</text>
  
  <line x1="630" y1="260" x2="590" y2="260" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Update Password -->
  <rect x="470" y="210" width="140" height="100" rx="8" fill="${C.success}"/>
  <text x="540" y="240" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.bg}">Update Password</text>
  <text x="540" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Hash new password</text>
  <text x="540" y="280" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Update DB</text>
  <text x="540" y="295" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Invalidate token</text>
  
  <line x1="470" y1="260" x2="430" y2="260" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Invalidate Sessions -->
  <rect x="240" y="210" width="180" height="100" rx="8" fill="${C.panel}" stroke="${C.danger}" stroke-width="2"/>
  <text x="330" y="240" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Security Actions</text>
  <text x="330" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Revoke all sessions</text>
  <text x="330" y="280" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Invalidate tokens</text>
  <text x="330" y="295" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Audit log event</text>
  
  <line x1="240" y1="260" x2="200" y2="260" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Notify -->
  <rect x="50" y="210" width="140" height="100" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="120" y="240" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Notify User</text>
  <text x="120" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Confirmation email</text>
  <text x="120" y="280" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Security alert</text>
  <text x="120" y="295" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">If not you, contact</text>
  
  <!-- Security Best Practices -->
  <rect x="50" y="340" width="700" height="110" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="365" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Security Best Practices</text>
  
  <rect x="70" y="385" width="150" height="30" rx="4" fill="${C.panel}"/>
  <text x="145" y="405" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Rate limit requests</text>
  
  <rect x="240" y="385" width="150" height="30" rx="4" fill="${C.panel}"/>
  <text x="315" y="405" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Single-use tokens</text>
  
  <rect x="410" y="385" width="150" height="30" rx="4" fill="${C.panel}"/>
  <text x="485" y="405" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Short expiry (1h)</text>
  
  <rect x="580" y="385" width="150" height="30" rx="4" fill="${C.panel}"/>
  <text x="655" y="405" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Hash tokens in DB</text>
  
  <rect x="70" y="425" width="150" height="30" rx="4" fill="${C.panel}"/>
  <text x="145" y="445" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Generic error messages</text>
  
  <rect x="240" y="425" width="150" height="30" rx="4" fill="${C.panel}"/>
  <text x="315" y="445" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Force re-login</text>
  
  <rect x="410" y="425" width="150" height="30" rx="4" fill="${C.panel}"/>
  <text x="485" y="445" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Audit trail</text>
  
  <rect x="580" y="425" width="150" height="30" rx="4" fill="${C.panel}"/>
  <text x="655" y="445" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Notify on success</text>
`));

console.log("✅ Batch 4 complete: 6 MFA & Password diagrams created");
