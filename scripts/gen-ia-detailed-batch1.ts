#!/usr/bin/env node
/**
 * Generate Detailed Identity & Access Diagrams
 * Batch 1: Authentication & Login (15 diagrams)
 */

import * as fs from "fs";
import * as path from "path";

const DIR = "public/diagrams/requirements/functional-requirements/identity-access";

// Color palette
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

// 1. Login Interface Flow
fs.writeFileSync(path.join(DIR, "login-interface-flow.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Login Interface Flow</text>
  
  <!-- User -->
  <circle cx="80" cy="250" r="35" fill="${C.primary}"/>
  <text x="80" y="255" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">User</text>
  
  <!-- Login Form -->
  <rect x="180" y="120" width="160" height="260" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="260" y="150" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Login Form</text>
  <rect x="200" y="170" width="120" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="260" y="192" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Email/Username</text>
  <rect x="200" y="215" width="120" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="260" y="237" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Password</text>
  <rect x="200" y="260" width="120" height="40" rx="4" fill="${C.primary}"/>
  <text x="260" y="285" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Sign In</text>
  <text x="260" y="320" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.primary}">Forgot Password?</text>
  <text x="260" y="345" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Social Login</text>
  <rect x="210" y="355" width="40" height="20" rx="3" fill="${C.secondary}"/>
  <rect x="260" y="355" width="40" height="20" rx="3" fill="${C.primary}"/>
  
  <!-- Auth Service -->
  <rect x="420" y="150" width="180" height="200" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="510" y="180" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Auth Service</text>
  <rect x="440" y="200" width="140" height="35" rx="4" fill="${C.panel2}"/>
  <text x="510" y="222" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Validate Credentials</text>
  <rect x="440" y="245" width="140" height="35" rx="4" fill="${C.panel2}"/>
  <text x="510" y="267" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">MFA Challenge</text>
  <rect x="440" y="290" width="140" height="35" rx="4" fill="${C.success}"/>
  <text x="510" y="312" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Generate JWT</text>
  
  <!-- Database -->
  <rect x="660" y="200" width="100" height="100" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="710" y="240" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">User DB</text>
  <text x="710" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">bcrypt hash</text>
  <text x="710" y="280" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">salt</text>
  
  <!-- Arrows -->
  <line x1="115" y1="250" x2="170" y2="250" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="142" y="240" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">1. Submit</text>
  
  <line x1="340" y1="250" x2="410" y2="250" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="375" y="240" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">2. Validate</text>
  
  <line x1="600" y1="250" x2="650" y2="250" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="625" y="240" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">3. Query</text>
  
  <line x1="650" y1="280" x2="600" y2="280" stroke="${C.success}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="625" y="295" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.success}">4. Return hash</text>
  
  <line x1="510" y1="350" x2="260" y2="350" stroke="${C.success}" stroke-width="2" stroke-dasharray="5,5" marker-end="url(#arrow)"/>
  <text x="385" y="370" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.success}">5. JWT Token</text>
`));

// 2. Login Security
fs.writeFileSync(path.join(DIR, "login-security.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Login Security Layers</text>
  
  <!-- Threats -->
  <rect x="50" y="70" width="180" height="140" rx="8" fill="${C.panel}" stroke="${C.danger}" stroke-width="2"/>
  <text x="140" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.danger}">Threats</text>
  <text x="140" y="125" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Credential Stuffing</text>
  <text x="140" y="145" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Brute Force</text>
  <text x="140" y="165" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Phishing</text>
  <text x="140" y="185" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Keylogging</text>
  <text x="140" y="205" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Session Hijacking</text>
  
  <!-- Defenses -->
  <rect x="260" y="70" width="280" height="280" rx="8" fill="${C.panel}" stroke="${C.success}" stroke-width="2"/>
  <text x="400" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.success}">Security Controls</text>
  
  <rect x="280" y="115" width="240" height="45" rx="4" fill="${C.success}" opacity="0.9"/>
  <text x="400" y="135" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">Rate Limiting</text>
  <text x="400" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">5 attempts/hour, exponential backoff</text>
  
  <rect x="280" y="170" width="240" height="45" rx="4" fill="${C.primary}" opacity="0.9"/>
  <text x="400" y="190" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">MFA/2FA</text>
  <text x="400" y="205" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">TOTP, SMS, Email, WebAuthn</text>
  
  <rect x="280" y="225" width="240" height="45" rx="4" fill="${C.secondary}" opacity="0.9"/>
  <text x="400" y="245" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">Password Policy</text>
  <text x="400" y="260" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Min 12 chars, complexity, breach check</text>
  
  <rect x="280" y="280" width="240" height="45" rx="4" fill="${C.warning}" opacity="0.9"/>
  <text x="400" y="300" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">CAPTCHA</text>
  <text x="400" y="315" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">After 3 failed attempts</text>
  
  <!-- Monitoring -->
  <rect x="570" y="70" width="180" height="140" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="660" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Monitoring</text>
  <text x="660" y="125" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Login Attempt Logs</text>
  <text x="660" y="145" font-family="system-ui" font-size="10" fill="${C.textMuted}">• IP Reputation</text>
  <text x="660" y="165" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Device Fingerprint</text>
  <text x="660" y="185" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Anomaly Detection</text>
  <text x="660" y="205" font-family="system-ui" font-size="10" fill="${C.textMuted}">• Alert on Suspicious</text>
  
  <!-- TLS -->
  <rect x="260" y="370" width="280" height="60" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="395" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Transport Security</text>
  <text x="400" y="415" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">TLS 1.3, HSTS, Secure Cookies (HttpOnly, Secure, SameSite)</text>
`));

// 3. Login UX Patterns
fs.writeFileSync(path.join(DIR, "login-ux-patterns.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Login UX Patterns</text>
  
  <!-- Traditional -->
  <rect x="50" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="160" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Traditional Form</text>
  <rect x="70" y="115" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="160" y="137" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Email</text>
  <rect x="70" y="155" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="160" y="177" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Password</text>
  <rect x="70" y="195" width="180" height="35" rx="4" fill="${C.primary}"/>
  <text x="160" y="217" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Sign In</text>
  <text x="160" y="240" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Simple</text>
  <text x="160" y="255" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.warning}">⚠ Password fatigue</text>
  
  <!-- Social Login -->
  <rect x="290" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Social Login</text>
  <rect x="310" y="115" width="180" height="35" rx="4" fill="${C.primary}"/>
  <text x="400" y="137" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Continue with Google</text>
  <rect x="310" y="155" width="180" height="35" rx="4" fill="${C.secondary}"/>
  <text x="400" y="177" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Continue with Apple</text>
  <rect x="310" y="195" width="180" height="35" rx="4" fill="#1877F2"/>
  <text x="400" y="217" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Continue with Facebook</text>
  <text x="400" y="240" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ One-click</text>
  <text x="400" y="255" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.warning}">⚠ Privacy concerns</text>
  
  <!-- Passwordless -->
  <rect x="530" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="640" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Passwordless</text>
  <rect x="550" y="115" width="180" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="640" y="137" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Email for Magic Link</text>
  <rect x="550" y="155" width="180" height="35" rx="4" fill="${C.primary}"/>
  <text x="640" y="177" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Send Magic Link</text>
  <text x="640" y="205" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Or use WebAuthn</text>
  <text x="640" y="240" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ No password</text>
  <text x="640" y="255" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Phishing resistant</text>
  
  <!-- Biometric -->
  <rect x="50" y="280" width="220" height="150" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="160" y="305" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Biometric</text>
  <circle cx="160" cy="355" r="30" fill="${C.panel2}" stroke="${C.primary}" stroke-width="2"/>
  <text x="160" y="360" text-anchor="middle" font-family="system-ui" font-size="20" fill="${C.primary}">👆</text>
  <text x="160" y="395" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Touch ID / Face ID</text>
  <text x="160" y="415" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Fastest</text>
  
  <!-- SSO -->
  <rect x="290" y="280" width="220" height="150" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="305" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Enterprise SSO</text>
  <rect x="310" y="325" width="180" height="40" rx="4" fill="${C.panel2}"/>
  <text x="400" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">SAML 2.0 / OIDC</text>
  <text x="400" y="375" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Okta, Azure AD, OneLogin</text>
  <text x="400" y="395" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Centralized</text>
  
  <!-- MFA -->
  <rect x="530" y="280" width="220" height="150" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="640" y="305" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Adaptive MFA</text>
  <rect x="550" y="325" width="180" height="40" rx="4" fill="${C.warning}" opacity="0.8"/>
  <text x="640" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Risk-based Challenge</text>
  <text x="640" y="375" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">New device, location, behavior</text>
  <text x="640" y="395" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Balanced UX/Security</text>
`));

// 4. Login Tracking Implementation
fs.writeFileSync(path.join(DIR, "login-tracking-implementation.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Login Attempt Tracking</text>
  
  <!-- Login Request -->
  <rect x="50" y="80" width="120" height="60" rx="8" fill="${C.primary}"/>
  <text x="110" y="105" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">Login Request</text>
  <text x="110" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">email, password</text>
  
  <!-- Rate Limiter -->
  <rect x="220" y="70" width="140" height="80" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="290" y="95" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Rate Limiter</text>
  <text x="290" y="120" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Redis: login_attempts:{email}</text>
  <text x="290" y="135" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">TTL: 1 hour</text>
  
  <!-- Decision -->
  <rect x="410" y="70" width="100" height="80" rx="8" fill="${C.warning}"/>
  <text x="460" y="100" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="bold" fill="${C.text}">Attempts</text>
  <text x="460" y="120" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">&gt; 5?</text>
  
  <!-- Blocked -->
  <rect x="560" y="70" width="100" height="80" rx="8" fill="${C.danger}"/>
  <text x="610" y="105" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">Blocked</text>
  <text x="610" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Exponential</text>
  <text x="610" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Backoff</text>
  
  <!-- Allow -->
  <rect x="560" y="180" width="100" height="80" rx="8" fill="${C.success}"/>
  <text x="610" y="215" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">Allow</text>
  <text x="610" y="235" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Proceed to</text>
  <text x="610" y="250" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Auth</text>
  
  <!-- Auth Service -->
  <rect x="220" y="200" width="140" height="80" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="290" y="225" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Auth Service</text>
  <text x="290" y="250" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">bcrypt compare</text>
  <text x="290" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Constant time</text>
  
  <!-- Log -->
  <rect x="410" y="200" width="140" height="80" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="480" y="225" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Audit Log</text>
  <text x="480" y="250" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">timestamp</text>
  <text x="480" y="265" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">IP, user-agent</text>
  <text x="480" y="280" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">result</text>
  
  <!-- Arrows -->
  <line x1="170" y1="110" x2="210" y2="110" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="360" y1="110" x2="400" y2="110" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="510" y1="110" x2="550" y2="110" stroke="${C.danger}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="460" y1="150" x2="460" y2="170" stroke="${C.success}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="510" y1="210" x2="550" y2="210" stroke="${C.success}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="360" y1="240" x2="400" y2="240" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
`));

// 5. Login Threat Detection
fs.writeFileSync(path.join(DIR, "login-threat-detection.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Login Threat Detection</text>
  
  <!-- Input Signals -->
  <rect x="50" y="70" width="150" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="125" y="95" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Input Signals</text>
  <text x="125" y="125" font-family="system-ui" font-size="9" fill="${C.textMuted}">• IP Address</text>
  <text x="125" y="140" font-family="system-ui" font-size="9" fill="${C.textMuted}">• User-Agent</text>
  <text x="125" y="155" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Device Fingerprint</text>
  <text x="125" y="170" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Geolocation</text>
  <text x="125" y="185" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Time of Day</text>
  <text x="125" y="200" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Typing Pattern</text>
  <text x="125" y="215" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Email Domain</text>
  
  <!-- Risk Engine -->
  <rect x="240" y="70" width="200" height="180" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="340" y="95" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Risk Engine</text>
  
  <rect x="260" y="110" width="160" height="30" rx="4" fill="${C.panel2}"/>
  <text x="340" y="130" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">IP Reputation: 0.8</text>
  
  <rect x="260" y="145" width="160" height="30" rx="4" fill="${C.panel2}"/>
  <text x="340" y="165" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Geo Anomaly: 0.6</text>
  
  <rect x="260" y="180" width="160" height="30" rx="4" fill="${C.panel2}"/>
  <text x="340" y="200" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Device Mismatch: 0.9</text>
  
  <rect x="260" y="215" width="160" height="30" rx="4" fill="${C.warning}"/>
  <text x="340" y="235" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="bold" fill="${C.text}">Risk Score: 0.77</text>
  
  <!-- Decision -->
  <rect x="480" y="70" width="140" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="550" y="95" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Decision</text>
  
  <rect x="500" y="115" width="100" height="35" rx="4" fill="${C.success}"/>
  <text x="550" y="137" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Low (&lt;0.3)</text>
  <text x="550" y="150" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.bg}">Allow</text>
  
  <rect x="500" y="155" width="100" height="35" rx="4" fill="${C.warning}"/>
  <text x="550" y="177" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Medium (0.3-0.7)</text>
  <text x="550" y="190" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.text}">MFA Challenge</text>
  
  <rect x="500" y="195" width="100" height="35" rx="4" fill="${C.danger}"/>
  <text x="550" y="217" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">High (&gt;0.7)</text>
  <text x="550" y="230" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.bg}">Block + Alert</text>
  
  <!-- Response Actions -->
  <rect x="660" y="70" width="100" height="180" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="710" y="95" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Actions</text>
  <text x="710" y="125" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Send Alert</text>
  <text x="710" y="140" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Log Event</text>
  <text x="710" y="155" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Notify User</text>
  <text x="710" y="170" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Temp Lock</text>
  <text x="710" y="185" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Require Reset</text>
  <text x="710" y="200" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Flag for Review</text>
  <text x="710" y="215" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Add to Blocklist</text>
  
  <!-- Arrows -->
  <line x1="200" y1="160" x2="230" y2="160" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="440" y1="160" x2="470" y2="160" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="620" y1="160" x2="650" y2="160" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
`));

console.log("✅ Batch 1 complete: 5 Authentication & Login diagrams created");
