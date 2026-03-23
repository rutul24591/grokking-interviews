#!/usr/bin/env node
/**
 * Generate Detailed Identity & Access Diagrams
 * Batch 2: Session Management (12 diagrams)
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

// 1. Session Lifecycle
fs.writeFileSync(path.join(DIR, "session-lifecycle.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Session Lifecycle</text>
  
  <!-- Create -->
  <rect x="50" y="80" width="140" height="120" rx="8" fill="${C.success}"/>
  <text x="120" y="110" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">1. Create</text>
  <text x="120" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Post-login</text>
  <text x="120" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Generate session_id</text>
  <text x="120" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Set cookie/token</text>
  <text x="120" y="185" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Store in DB/cache</text>
  
  <line x1="190" y1="140" x2="230" y2="140" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Active -->
  <rect x="240" y="80" width="140" height="120" rx="8" fill="${C.primary}"/>
  <text x="310" y="110" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">2. Active</text>
  <text x="310" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">User requests</text>
  <text x="310" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Validate token</text>
  <text x="310" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Update last_seen</text>
  <text x="310" y="185" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Extend TTL</text>
  
  <line x1="380" y1="140" x2="420" y2="140" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Idle -->
  <rect x="430" y="80" width="140" height="120" rx="8" fill="${C.warning}"/>
  <text x="500" y="110" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">3. Idle</text>
  <text x="500" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">No activity</text>
  <text x="500" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">TTL expiring</text>
  <text x="500" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Warning email?</text>
  <text x="500" y="185" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Grace period</text>
  
  <line x1="570" y1="140" x2="610" y2="140" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Expired -->
  <rect x="620" y="80" width="140" height="120" rx="8" fill="${C.danger}"/>
  <text x="690" y="110" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">4. Expired</text>
  <text x="690" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">TTL reached</text>
  <text x="690" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Token invalid</text>
  <text x="690" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Logout required</text>
  <text x="690" y="185" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Cleanup job</text>
  
  <!-- Timeline -->
  <rect x="50" y="250" width="700" height="180" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="280" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Session Timeline</text>
  
  <line x1="100" y1="320" x2="700" y2="320" stroke="${C.textMuted}" stroke-width="2"/>
  <circle cx="100" cy="320" r="8" fill="${C.success}"/>
  <circle cx="300" cy="320" r="8" fill="${C.primary}"/>
  <circle cx="500" cy="320" r="8" fill="${C.warning}"/>
  <circle cx="700" cy="320" r="8" fill="${C.danger}"/>
  
  <text x="100" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">T0</text>
  <text x="100" y="365" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Login</text>
  
  <text x="300" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">T0+30min</text>
  <text x="300" y="365" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Active use</text>
  
  <text x="500" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">T0+23h</text>
  <text x="500" y="365" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Idle warning</text>
  
  <text x="700" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">T0+24h</text>
  <text x="700" y="365" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Expired</text>
  
  <!-- Config -->
  <rect x="50" y="360" width="220" height="60" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="160" y="385" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">TTL Settings</text>
  <text x="160" y="405" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Access token: 15min</text>
  <text x="160" y="420" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Refresh token: 7d</text>
  
  <rect x="290" y="360" width="220" height="60" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="385" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Sliding Session</text>
  <text x="400" y="405" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Extend on activity</text>
  <text x="400" y="420" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Max absolute: 30d</text>
  
  <rect x="530" y="360" width="220" height="60" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="640" y="385" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Security</text>
  <text x="640" y="405" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Rotate on privilege change</text>
  <text x="640" y="420" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Invalidate on logout</text>
`));

// 2. Session Management Flow
fs.writeFileSync(path.join(DIR, "session-management-flow.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Session Management Flow</text>
  
  <!-- User -->
  <circle cx="80" cy="100" r="35" fill="${C.primary}"/>
  <text x="80" y="105" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">User</text>
  
  <!-- Login -->
  <rect x="180" y="70" width="120" height="60" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="240" y="105" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Login</text>
  
  <!-- Session Service -->
  <rect x="350" y="60" width="180" height="80" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="440" y="90" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Session Service</text>
  <text x="440" y="115" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Create/Validate/Refresh</text>
  
  <!-- Session Store -->
  <rect x="580" y="70" width="120" height="60" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="640" y="95" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Session Store</text>
  <text x="640" y="115" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Redis/DB</text>
  
  <!-- API Gateway -->
  <rect x="350" y="200" width="180" height="60" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="440" y="235" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">API Gateway</text>
  
  <!-- Microservices -->
  <rect x="180" y="300" width="100" height="60" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="230" y="325" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Service A</text>
  <text x="230" y="345" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Validate token</text>
  
  <rect x="340" y="300" width="100" height="60" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="390" y="325" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Service B</text>
  <text x="390" y="345" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Validate token</text>
  
  <rect x="500" y="300" width="100" height="60" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="550" y="325" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Service C</text>
  <text x="550" y="345" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Validate token</text>
  
  <!-- Arrows -->
  <line x1="115" y1="100" x2="170" y2="100" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="142" y="90" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">1. Credentials</text>
  
  <line x1="300" y1="100" x2="340" y2="100" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="320" y="90" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">2. Create session</text>
  
  <line x1="530" y1="100" x2="570" y2="100" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="550" y="90" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">3. Store</text>
  
  <line x1="440" y1="140" x2="440" y2="190" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="460" y="165" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">4. JWT</text>
  
  <line x1="440" y1="260" x2="230" y2="290" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="440" y1="260" x2="390" y2="290" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="440" y1="260" x2="550" y2="290" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
`));

// 3. Session Persistence Flow
fs.writeFileSync(path.join(DIR, "session-persistence-flow.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Session Persistence Strategies</text>
  
  <!-- Server-side -->
  <rect x="50" y="70" width="220" height="200" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="160" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Server-side Sessions</text>
  
  <rect x="70" y="115" width="180" height="40" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="160" y="140" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Session ID in cookie</text>
  
  <rect x="70" y="160" width="180" height="40" rx="4" fill="${C.primary}" opacity="0.8"/>
  <text x="160" y="185" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Session data in Redis/DB</text>
  
  <text x="160" y="225" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Easy invalidation</text>
  <text x="160" y="240" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Small cookies</text>
  <text x="160" y="255" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.warning}">⚠ DB dependency</text>
  
  <!-- Client-side JWT -->
  <rect x="290" y="70" width="220" height="200" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Client-side JWT</text>
  
  <rect x="310" y="115" width="180" height="40" rx="4" fill="${C.secondary}" opacity="0.8"/>
  <text x="400" y="140" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Full session in JWT</text>
  
  <rect x="310" y="160" width="180" height="40" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="185" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Signed, stateless</text>
  
  <text x="400" y="225" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ No DB lookup</text>
  <text x="400" y="240" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Scalable</text>
  <text x="400" y="255" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.danger}">⚠ Hard to revoke</text>
  
  <!-- Hybrid -->
  <rect x="530" y="70" width="220" height="200" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="640" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Hybrid Approach</text>
  
  <rect x="550" y="115" width="180" height="40" rx="4" fill="${C.primary}" opacity="0.8"/>
  <text x="640" y="140" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">JWT with jti claim</text>
  
  <rect x="550" y="160" width="180" height="40" rx="4" fill="${C.panel2}"/>
  <text x="640" y="185" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Revocation list in Redis</text>
  
  <text x="640" y="225" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Best of both</text>
  <text x="640" y="240" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Fast validation</text>
  <text x="640" y="255" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.warning}">⚠ Revocation list</text>
  
  <!-- Storage comparison -->
  <rect x="50" y="300" width="700" height="150" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="325" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Storage Comparison</text>
  
  <rect x="80" y="345" width="180" height="90" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="170" y="370" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Redis</text>
  <text x="170" y="395" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Fast (sub-ms)</text>
  <text x="170" y="410" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• TTL support</text>
  <text x="170" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Volatile</text>
  
  <rect x="290" y="345" width="180" height="90" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="380" y="370" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Database</text>
  <text x="380" y="395" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Persistent</text>
  <text x="380" y="410" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Slower (ms)</text>
  <text x="380" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Complex queries</text>
  
  <rect x="500" y="345" width="180" height="90" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="590" y="370" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">In-Memory</text>
  <text x="590" y="395" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Fastest</text>
  <text x="590" y="410" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Single instance</text>
  <text x="590" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Not distributed</text>
`));

// 4. Session Metadata
fs.writeFileSync(path.join(DIR, "session-metadata.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Session Metadata Schema</text>
  
  <!-- Session Object -->
  <rect x="50" y="70" width="340" height="380" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="95" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Session Object</text>
  
  <!-- Core fields -->
  <rect x="70" y="115" width="300" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="90" y="137" font-family="monospace" font-size="10" fill="${C.primary}">session_id</text>
  <text x="200" y="137" font-family="system-ui" font-size="10" fill="${C.textMuted}">UUID v4</text>
  
  <rect x="70" y="155" width="300" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="90" y="177" font-family="monospace" font-size="10" fill="${C.primary}">user_id</text>
  <text x="200" y="177" font-family="system-ui" font-size="10" fill="${C.textMuted}">Reference to users table</text>
  
  <rect x="70" y="195" width="300" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="90" y="217" font-family="monospace" font-size="10" fill="${C.primary}">created_at</text>
  <text x="200" y="217" font-family="system-ui" font-size="10" fill="${C.textMuted}">ISO 8601 timestamp</text>
  
  <rect x="70" y="235" width="300" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="90" y="257" font-family="monospace" font-size="10" fill="${C.primary}">expires_at</text>
  <text x="200" y="257" font-family="system-ui" font-size="10" fill="${C.textMuted}">Absolute expiry</text>
  
  <rect x="70" y="275" width="300" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="90" y="297" font-family="monospace" font-size="10" fill="${C.primary}">last_seen_at</text>
  <text x="200" y="297" font-family="system-ui" font-size="10" fill="${C.textMuted}">For sliding sessions</text>
  
  <rect x="70" y="315" width="300" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="90" y="337" font-family="monospace" font-size="10" fill="${C.primary}">status</text>
  <text x="200" y="337" font-family="system-ui" font-size="10" fill="${C.textMuted}">active | idle | expired | revoked</text>
  
  <rect x="70" y="355" width="300" height="35" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="90" y="377" font-family="monospace" font-size="10" fill="${C.primary}">roles</text>
  <text x="200" y="377" font-family="system-ui" font-size="10" fill="${C.textMuted}">Array of role IDs</text>
  
  <!-- Device Info -->
  <rect x="420" y="70" width="330" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="585" y="95" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Device Metadata</text>
  
  <rect x="440" y="115" width="290" height="30" rx="4" fill="${C.panel2}"/>
  <text x="460" y="135" font-family="monospace" font-size="9" fill="${C.text}">ip_address</text>
  <text x="580" y="135" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">192.168.1.1</text>
  
  <rect x="440" y="150" width="290" height="30" rx="4" fill="${C.panel2}"/>
  <text x="460" y="170" font-family="monospace" font-size="9" fill="${C.text}">user_agent</text>
  <text x="580" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Mozilla/5.0...</text>
  
  <rect x="440" y="185" width="290" height="30" rx="4" fill="${C.panel2}"/>
  <text x="460" y="205" font-family="monospace" font-size="9" fill="${C.text}">device_fingerprint</text>
  <text x="580" y="205" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Hash</text>
  
  <rect x="440" y="220" width="290" height="30" rx="4" fill="${C.panel2}"/>
  <text x="460" y="240" font-family="monospace" font-size="9" fill="${C.text}">geo_location</text>
  <text x="580" y="240" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">{lat, lon, city}</text>
  
  <!-- Security -->
  <rect x="420" y="270" width="330" height="180" rx="8" fill="${C.panel}" stroke="${C.danger}" stroke-width="2"/>
  <text x="585" y="295" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Security Fields</text>
  
  <rect x="440" y="315" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="460" y="335" font-family="monospace" font-size="9" fill="${C.text}">auth_method</text>
  <text x="580" y="335" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">password | mfa | sso</text>
  
  <rect x="440" y="350" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="460" y="370" font-family="monospace" font-size="9" fill="${C.text}">mfa_verified</text>
  <text x="580" y="370" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">boolean</text>
  
  <rect x="440" y="385" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="460" y="405" font-family="monospace" font-size="9" fill="${C.text}">revocation_reason</text>
  <text x="580" y="405" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">user_logout | security | admin</text>
  
  <rect x="440" y="420" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="460" y="440" font-family="monospace" font-size="9" fill="${C.text}">risk_score</text>
  <text x="580" y="440" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">0.0 - 1.0</text>
`));

// 5. Session Actions
fs.writeFileSync(path.join(DIR, "session-actions.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Session Actions & Operations</text>
  
  <!-- Create -->
  <rect x="50" y="70" width="140" height="100" rx="8" fill="${C.success}"/>
  <text x="120" y="100" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">Create</text>
  <text x="120" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">On successful login</text>
  <text x="120" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Generate session_id</text>
  <text x="120" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Set TTL</text>
  
  <line x1="190" y1="120" x2="230" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Validate -->
  <rect x="240" y="70" width="140" height="100" rx="8" fill="${C.primary}"/>
  <text x="310" y="100" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">Validate</text>
  <text x="310" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Check signature</text>
  <text x="310" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Check expiry</text>
  <text x="310" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Check revocation</text>
  
  <line x1="380" y1="120" x2="420" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Refresh -->
  <rect x="430" y="70" width="140" height="100" rx="8" fill="${C.warning}"/>
  <text x="500" y="100" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Refresh</text>
  <text x="500" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Extend TTL</text>
  <text x="500" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Update last_seen</text>
  <text x="500" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Rotate token</text>
  
  <line x1="570" y1="120" x2="610" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Revoke -->
  <rect x="620" y="70" width="140" height="100" rx="8" fill="${C.danger}"/>
  <text x="690" y="100" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">Revoke</text>
  <text x="690" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">User logout</text>
  <text x="690" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Security event</text>
  <text x="690" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Admin action</text>
  
  <!-- Bulk Actions -->
  <rect x="50" y="210" width="340" height="140" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="240" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Bulk Operations</text>
  
  <rect x="70" y="260" width="300" height="35" rx="4" fill="${C.panel2}"/>
  <text x="220" y="282" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Revoke All Sessions (User)</text>
  <text x="350" y="282" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.textMuted}">Password change</text>
  
  <rect x="70" y="300" width="300" height="35" rx="4" fill="${C.panel2}"/>
  <text x="220" y="322" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Revoke by Device</text>
  <text x="350" y="322" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.textMuted}">Lost phone</text>
  
  <rect x="70" y="340" width="300" height="35" rx="4" fill="${C.panel2}"/>
  <text x="220" y="362" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Revoke by Location</text>
  <text x="350" y="362" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.textMuted}">Suspicious region</text>
  
  <!-- Cleanup -->
  <rect x="420" y="210" width="330" height="140" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="585" y="240" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Cleanup Jobs</text>
  
  <rect x="440" y="260" width="290" height="35" rx="4" fill="${C.panel2}"/>
  <text x="585" y="282" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Expired Session Cleanup</text>
  <text x="710" y="282" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.textMuted}">Hourly</text>
  
  <rect x="440" y="300" width="290" height="35" rx="4" fill="${C.panel2}"/>
  <text x="585" y="322" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Revoked Token Cleanup</text>
  <text x="710" y="322" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.textMuted}">Daily</text>
  
  <rect x="440" y="340" width="290" height="35" rx="4" fill="${C.panel2}"/>
  <text x="585" y="362" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Audit Log Archival</text>
  <text x="710" y="362" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.textMuted}">Weekly</text>
`));

// 6. Session Security
fs.writeFileSync(path.join(DIR, "session-security.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Session Security Measures</text>
  
  <!-- Cookie Security -->
  <rect x="50" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="160" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Cookie Security</text>
  
  <rect x="70" y="115" width="180" height="30" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="160" y="135" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">HttpOnly</text>
  
  <rect x="70" y="150" width="180" height="30" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="160" y="170" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Secure (HTTPS only)</text>
  
  <rect x="70" y="185" width="180" height="30" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="160" y="205" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">SameSite=Strict</text>
  
  <rect x="70" y="220" width="180" height="20" rx="4" fill="${C.panel2}"/>
  <text x="160" y="235" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Prevents XSS, CSRF</text>
  
  <!-- Token Security -->
  <rect x="290" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Token Security</text>
  
  <rect x="310" y="115" width="180" height="30" rx="4" fill="${C.primary}" opacity="0.8"/>
  <text x="400" y="135" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">JWT with RS256</text>
  
  <rect x="310" y="150" width="180" height="30" rx="4" fill="${C.primary}" opacity="0.8"/>
  <text x="400" y="170" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Short expiry (15min)</text>
  
  <rect x="310" y="185" width="180" height="30" rx="4" fill="${C.primary}" opacity="0.8"/>
  <text x="400" y="205" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Refresh tokens</text>
  
  <rect x="310" y="220" width="180" height="20" rx="4" fill="${C.panel2}"/>
  <text x="400" y="235" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Rotation on use</text>
  
  <!-- Attack Prevention -->
  <rect x="530" y="70" width="220" height="180" rx="8" fill="${C.panel}" stroke="${C.danger}" stroke-width="2"/>
  <text x="640" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Attack Prevention</text>
  
  <rect x="550" y="115" width="180" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="640" y="135" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Session Fixation</text>
  <text x="710" y="135" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.success}">Regenerate ID</text>
  
  <rect x="550" y="150" width="180" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="640" y="170" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Session Hijacking</text>
  <text x="710" y="170" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.success}">Fingerprint binding</text>
  
  <rect x="550" y="185" width="180" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="640" y="205" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">CSRF</text>
  <text x="710" y="205" text-anchor="end" font-family="system-ui" font-size="9" fill="${C.success}">SameSite + CSRF token</text>
  
  <rect x="550" y="220" width="180" height="20" rx="4" fill="${C.panel2}"/>
  <text x="640" y="235" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">XSS: Content Security Policy</text>
  
  <!-- Detection -->
  <rect x="50" y="280" width="340" height="140" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="220" y="310" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Anomaly Detection</text>
  
  <rect x="70" y="330" width="280" height="30" rx="4" fill="${C.panel2}"/>
  <text x="210" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">IP address change mid-session</text>
  
  <rect x="70" y="365" width="280" height="30" rx="4" fill="${C.panel2}"/>
  <text x="210" y="385" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Geographic impossibility</text>
  
  <rect x="70" y="400" width="280" height="20" rx="4" fill="${C.panel2}"/>
  <text x="210" y="415" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">User-Agent change, device fingerprint mismatch</text>
  
  <!-- Response -->
  <rect x="420" y="280" width="330" height="140" rx="8" fill="${C.panel}" stroke="${C.danger}" stroke-width="2"/>
  <text x="585" y="310" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Security Response</text>
  
  <rect x="440" y="330" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Immediate revocation</text>
  
  <rect x="440" y="365" width="290" height="30" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="585" y="385" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Force re-authentication</text>
  
  <rect x="440" y="400" width="290" height="20" rx="4" fill="${C.panel2}"/>
  <text x="585" y="415" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Alert user, log security event, notify admin</text>
`));

// 7. Session Token Refresh
fs.writeFileSync(path.join(DIR, "session-token-refresh.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Token Refresh Flow</text>
  
  <!-- Client -->
  <rect x="50" y="80" width="120" height="80" rx="8" fill="${C.primary}"/>
  <text x="110" y="115" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.bg}">Client</text>
  <text x="110" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Access token expired</text>
  
  <!-- Refresh Endpoint -->
  <rect x="220" y="70" width="160" height="100" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="300" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">/refresh</text>
  <text x="300" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Validate refresh token</text>
  <text x="300" y="145" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Check revocation list</text>
  <text x="300" y="160" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Rate limit check</text>
  
  <!-- Session Service -->
  <rect x="430" y="70" width="160" height="100" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="510" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Session Service</text>
  <text x="510" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Generate new access</text>
  <text x="510" y="145" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Rotate refresh token</text>
  <text x="510" y="160" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Update last_seen</text>
  
  <!-- Token Store -->
  <rect x="640" y="80" width="120" height="80" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="700" y="115" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Token Store</text>
  <text x="700" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Redis</text>
  
  <!-- Arrows -->
  <line x1="170" y1="120" x2="210" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="190" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">1. POST refresh_token</text>
  
  <line x1="380" y1="120" x2="420" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="400" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">2. Validate</text>
  
  <line x1="590" y1="120" x2="630" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="610" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">3. Invalidate old</text>
  
  <line x1="630" y1="140" x2="590" y2="140" stroke="${C.success}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="610" y="155" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.success}">4. Store new</text>
  
  <line x1="420" y1="150" x2="380" y2="150" stroke="${C.success}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="400" y="165" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.success}">5. New tokens</text>
  
  <line x1="210" y1="150" x2="170" y2="150" stroke="${C.success}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="190" y="165" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.success}">6. Set cookies</text>
  
  <!-- Token Lifecycle -->
  <rect x="50" y="220" width="700" height="200" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="250" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Token Lifecycle Timeline</text>
  
  <line x1="100" y1="290" x2="700" y2="290" stroke="${C.textMuted}" stroke-width="2"/>
  
  <rect x="100" y="270" width="150" height="40" rx="4" fill="${C.success}"/>
  <text x="175" y="295" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Access Token</text>
  <text x="175" y="325" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">15 min</text>
  
  <rect x="250" y="270" width="300" height="40" rx="4" fill="${C.primary}"/>
  <text x="400" y="295" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Refresh Token</text>
  <text x="400" y="325" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">7 days</text>
  
  <!-- Refresh points -->
  <circle cx="280" cy="290" r="6" fill="${C.warning}"/>
  <text x="280" y="355" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Refresh #1</text>
  
  <circle cx="400" cy="290" r="6" fill="${C.warning}"/>
  <text x="400" y="355" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Refresh #2</text>
  
  <circle cx="520" cy="290" r="6" fill="${C.warning}"/>
  <text x="520" y="355" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Refresh #3</text>
  
  <!-- Rotation -->
  <rect x="100" y="380" width="200" height="30" rx="4" fill="${C.panel}"/>
  <text x="200" y="400" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Old refresh token invalidated</text>
  
  <rect x="320" y="380" width="200" height="30" rx="4" fill="${C.panel}"/>
  <text x="420" y="400" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">New refresh token issued</text>
  
  <rect x="540" y="380" width="150" height="30" rx="4" fill="${C.danger}"/>
  <text x="615" y="400" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Reuse = Revocation</text>
`));

console.log("✅ Batch 2 complete: 7 Session Management diagrams created");
