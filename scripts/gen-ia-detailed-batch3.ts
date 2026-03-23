#!/usr/bin/env node
/**
 * Generate Detailed Identity & Access Diagrams
 * Batch 3: Authorization & RBAC (10 diagrams)
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

// 1. RBAC Model
fs.writeFileSync(path.join(DIR, "rbac-model.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Role-Based Access Control (RBAC) Model</text>
  
  <!-- Users -->
  <rect x="50" y="70" width="150" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="125" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Users</text>
  
  <circle cx="85" cy="130" r="25" fill="${C.primary}"/>
  <text x="85" y="135" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Alice</text>
  
  <circle cx="165" cy="130" r="25" fill="${C.primary}"/>
  <text x="165" y="135" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Bob</text>
  
  <circle cx="85" cy="180" r="25" fill="${C.primary}"/>
  <text x="85" y="185" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Carol</text>
  
  <circle cx="165" cy="180" r="25" fill="${C.primary}"/>
  <text x="165" y="185" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Dave</text>
  
  <line x1="200" y1="160" x2="240" y2="160" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="220" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">assigned to</text>
  
  <!-- Roles -->
  <rect x="250" y="70" width="200" height="180" rx="8" fill="${C.panel}" stroke="${C.secondary}" stroke-width="2"/>
  <text x="350" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Roles</text>
  
  <rect x="270" y="110" width="160" height="35" rx="4" fill="${C.secondary}" opacity="0.8"/>
  <text x="350" y="132" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Admin</text>
  
  <rect x="270" y="150" width="160" height="35" rx="4" fill="${C.secondary}" opacity="0.6"/>
  <text x="350" y="172" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Editor</text>
  
  <rect x="270" y="190" width="160" height="35" rx="4" fill="${C.secondary}" opacity="0.4"/>
  <text x="350" y="212" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Viewer</text>
  
  <line x1="450" y1="160" x2="490" y2="160" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="470" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">grants</text>
  
  <!-- Permissions -->
  <rect x="500" y="70" width="250" height="180" rx="8" fill="${C.panel}" stroke="${C.success}" stroke-width="2"/>
  <text x="625" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Permissions</text>
  
  <rect x="520" y="110" width="100" height="30" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="570" y="130" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">user:create</text>
  
  <rect x="630" y="110" width="100" height="30" rx="4" fill="${C.success}" opacity="0.8"/>
  <text x="680" y="130" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">user:delete</text>
  
  <rect x="520" y="145" width="100" height="30" rx="4" fill="${C.success}" opacity="0.6"/>
  <text x="570" y="165" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">content:edit</text>
  
  <rect x="630" y="145" width="100" height="30" rx="4" fill="${C.success}" opacity="0.6"/>
  <text x="680" y="165" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">content:publish</text>
  
  <rect x="520" y="180" width="100" height="30" rx="4" fill="${C.success}" opacity="0.4"/>
  <text x="570" y="200" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">content:view</text>
  
  <rect x="630" y="180" width="100" height="30" rx="4" fill="${C.success}" opacity="0.4"/>
  <text x="680" y="200" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">profile:read</text>
  
  <!-- Role Hierarchy -->
  <rect x="50" y="280" width="340" height="170" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="305" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Role Hierarchy</text>
  
  <rect x="140" y="325" width="160" height="35" rx="4" fill="${C.danger}" opacity="0.8"/>
  <text x="220" y="347" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.bg}">Super Admin</text>
  
  <line x1="220" y1="360" x2="140" y2="380" stroke="${C.textMuted}" stroke-width="2"/>
  <line x1="220" y1="360" x2="220" y2="380" stroke="${C.textMuted}" stroke-width="2"/>
  <line x1="220" y1="360" x2="300" y2="380" stroke="${C.textMuted}" stroke-width="2"/>
  
  <rect x="80" y="385" width="120" height="35" rx="4" fill="${C.secondary}" opacity="0.8"/>
  <text x="140" y="407" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Admin</text>
  
  <rect x="160" y="385" width="120" height="35" rx="4" fill="${C.secondary}" opacity="0.6"/>
  <text x="220" y="407" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Manager</text>
  
  <rect x="240" y="385" width="120" height="35" rx="4" fill="${C.secondary}" opacity="0.4"/>
  <text x="300" y="407" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.bg}">Editor</text>
  
  <line x1="140" y1="420" x2="100" y2="440" stroke="${C.textMuted}" stroke-width="2"/>
  <line x1="140" y1="420" x2="180" y2="440" stroke="${C.textMuted}" stroke-width="2"/>
  
  <rect x="60" y="445" width="80" height="30" rx="4" fill="${C.success}" opacity="0.4"/>
  <text x="100" y="465" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Viewer</text>
  
  <rect x="140" y="445" width="80" height="30" rx="4" fill="${C.success}" opacity="0.4"/>
  <text x="180" y="465" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">User</text>
  
  <!-- Core Principle -->
  <rect x="420" y="280" width="330" height="170" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="585" y="305" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Core RBAC Principle</text>
  
  <text x="585" y="340" text-anchor="middle" font-family="system-ui" font-size="11" fill="${C.text}">Users → Roles → Permissions</text>
  <text x="585" y="365" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">(NOT Users → Permissions directly)</text>
  
  <rect x="440" y="385" width="290" height="55" rx="4" fill="${C.panel}"/>
  <text x="585" y="410" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Benefits:</text>
  <text x="460" y="430" text-anchor="start" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Simplified management</text>
  <text x="585" y="430" text-anchor="start" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Role inheritance</text>
  <text x="460" y="445" text-anchor="start" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Least privilege enforcement</text>
  <text x="585" y="445" text-anchor="start" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Audit-friendly</text>
`));

// 2. RBAC Schema
fs.writeFileSync(path.join(DIR, "rbac-schema.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">RBAC Database Schema</text>
  
  <!-- Users Table -->
  <rect x="50" y="70" width="180" height="140" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="140" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">users</text>
  
  <rect x="70" y="110" width="140" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="85" y="127" font-family="monospace" font-size="9" fill="${C.primary}">id</text>
  <text x="150" y="127" font-family="system-ui" font-size="8" fill="${C.textMuted}">UUID PK</text>
  
  <rect x="70" y="138" width="140" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="85" y="155" font-family="monospace" font-size="9" fill="${C.text}">email</text>
  <text x="150" y="155" font-family="system-ui" font-size="8" fill="${C.textMuted}">unique</text>
  
  <rect x="70" y="166" width="140" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="85" y="183" font-family="monospace" font-size="9" fill="${C.text}">password_hash</text>
  
  <rect x="70" y="194" width="140" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="85" y="211" font-family="monospace" font-size="9" fill="${C.text}">created_at</text>
  
  <!-- User Roles Junction -->
  <rect x="280" y="100" width="160" height="110" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="360" y="125" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">user_roles</text>
  
  <rect x="300" y="140" width="120" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="315" y="157" font-family="monospace" font-size="9" fill="${C.primary}">user_id</text>
  <text x="380" y="157" font-family="system-ui" font-size="8" fill="${C.textMuted}">FK</text>
  
  <rect x="300" y="168" width="120" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="315" y="185" font-family="monospace" font-size="9" fill="${C.secondary}">role_id</text>
  <text x="380" y="185" font-family="system-ui" font-size="8" fill="${C.textMuted}">FK</text>
  
  <rect x="300" y="196" width="120" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="315" y="213" font-family="monospace" font-size="9" fill="${C.text}">assigned_at</text>
  
  <!-- Roles Table -->
  <rect x="50" y="250" width="180" height="140" rx="8" fill="${C.panel}" stroke="${C.secondary}" stroke-width="2"/>
  <text x="140" y="275" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">roles</text>
  
  <rect x="70" y="290" width="140" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="85" y="307" font-family="monospace" font-size="9" fill="${C.secondary}">id</text>
  <text x="150" y="307" font-family="system-ui" font-size="8" fill="${C.textMuted}">UUID PK</text>
  
  <rect x="70" y="318" width="140" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="85" y="335" font-family="monospace" font-size="9" fill="${C.text}">name</text>
  <text x="150" y="335" font-family="system-ui" font-size="8" fill="${C.textMuted}">admin, editor</text>
  
  <rect x="70" y="346" width="140" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="85" y="363" font-family="monospace" font-size="9" fill="${C.text}">description</text>
  
  <rect x="70" y="374" width="140" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="85" y="391" font-family="monospace" font-size="9" fill="${C.text}">parent_role_id</text>
  <text x="150" y="391" font-family="system-ui" font-size="8" fill="${C.textMuted}">self-ref FK</text>
  
  <!-- Role Permissions Junction -->
  <rect x="280" y="280" width="160" height="110" rx="8" fill="${C.panel}" stroke="${C.success}" stroke-width="2"/>
  <text x="360" y="305" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">role_permissions</text>
  
  <rect x="300" y="320" width="120" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="315" y="337" font-family="monospace" font-size="9" fill="${C.secondary}">role_id</text>
  <text x="380" y="337" font-family="system-ui" font-size="8" fill="${C.textMuted}">FK</text>
  
  <rect x="300" y="348" width="120" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="315" y="365" font-family="monospace" font-size="9" fill="${C.success}">permission_id</text>
  <text x="380" y="365" font-family="system-ui" font-size="8" fill="${C.textMuted}">FK</text>
  
  <rect x="300" y="376" width="120" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="315" y="393" font-family="monospace" font-size="9" fill="${C.text}">granted_at</text>
  
  <!-- Permissions Table -->
  <rect x="500" y="170" width="250" height="220" rx="8" fill="${C.panel}" stroke="${C.success}" stroke-width="2"/>
  <text x="625" y="195" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">permissions</text>
  
  <rect x="520" y="210" width="210" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="535" y="227" font-family="monospace" font-size="9" fill="${C.success}">id</text>
  <text x="600" y="227" font-family="system-ui" font-size="8" fill="${C.textMuted}">UUID PK</text>
  
  <rect x="520" y="238" width="210" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="535" y="255" font-family="monospace" font-size="9" fill="${C.text}">resource</text>
  <text x="650" y="255" font-family="system-ui" font-size="8" fill="${C.textMuted}">user, content</text>
  
  <rect x="520" y="266" width="210" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="535" y="283" font-family="monospace" font-size="9" fill="${C.text}">action</text>
  <text x="650" y="283" font-family="system-ui" font-size="8" fill="${C.textMuted}">create, read</text>
  
  <rect x="520" y="294" width="210" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="535" y="311" font-family="monospace" font-size="9" fill="${C.text}">scope</text>
  <text x="650" y="311" font-family="system-ui" font-size="8" fill="${C.textMuted}">own, all</text>
  
  <rect x="520" y="322" width="210" height="25" rx="3" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="535" y="339" font-family="monospace" font-size="9" fill="${C.text}">name</text>
  <text x="650" y="339" font-family="system-ui" font-size="8" fill="${C.textMuted}">user:create</text>
  
  <!-- Relationships -->
  <line x1="230" y1="160" x2="270" y2="160" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="250" y="150" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">N</text>
  
  <line x1="360" y1="210" x2="360" y2="240" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="370" y="225" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">N</text>
  
  <line x1="440" y1="160" x2="490" y2="280" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="465" y="220" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">N</text>
  
  <line x1="230" y1="320" x2="270" y2="320" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="250" y="310" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">N</text>
  
  <!-- Sample Data -->
  <rect x="500" y="410" width="250" height="80" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="625" y="435" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Sample Permission Names</text>
  <text x="520" y="455" font-family="monospace" font-size="9" fill="${C.textMuted}">user:create, user:read, user:update, user:delete</text>
  <text x="520" y="470" font-family="monospace" font-size="9" fill="${C.textMuted}">content:create, content:publish, content:delete</text>
  <text x="520" y="485" font-family="monospace" font-size="9" fill="${C.textMuted}">settings:read, settings:write, admin:access</text>
`));

// 3. RBAC vs ABAC
fs.writeFileSync(path.join(DIR, "rbac-vs-abac.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">RBAC vs ABAC Comparison</text>
  
  <!-- RBAC -->
  <rect x="50" y="70" width="340" height="380" rx="8" fill="${C.panel}" stroke="${C.secondary}" stroke-width="2"/>
  <text x="220" y="95" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="bold" fill="${C.secondary}">Role-Based Access Control</text>
  
  <rect x="70" y="115" width="300" height="80" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="220" y="140" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">How it Works</text>
  <text x="220" y="165" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Users assigned to Roles → Roles grant Permissions</text>
  <text x="220" y="185" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Access = f(User's Roles)</text>
  
  <rect x="70" y="210" width="300" height="70" rx="4" fill="${C.success}" opacity="0.2"/>
  <text x="220" y="235" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Pros</text>
  <text x="220" y="255" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Simple, intuitive, easy to audit</text>
  <text x="220" y="270" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Good for org structures</text>
  
  <rect x="70" y="295" width="300" height="70" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="220" y="320" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Cons</text>
  <text x="220" y="340" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Role explosion</text>
  <text x="220" y="355" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Cannot handle context (time, location)</text>
  
  <rect x="70" y="380" width="300" height="60" rx="4" fill="${C.panel2}"/>
  <text x="220" y="405" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Best For</text>
  <text x="220" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Internal tools, enterprise apps, clear org hierarchy</text>
  
  <!-- ABAC -->
  <rect x="410" y="70" width="340" height="380" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="580" y="95" text-anchor="middle" font-family="system-ui" font-size="16" font-weight="bold" fill="${C.primary}">Attribute-Based Access Control</text>
  
  <rect x="430" y="115" width="300" height="80" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="580" y="140" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">How it Works</text>
  <text x="580" y="165" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Access = f(Subject, Resource, Action, Context)</text>
  <text x="580" y="185" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Policy: "Allow if user.dept == resource.dept"</text>
  
  <rect x="430" y="210" width="300" height="70" rx="4" fill="${C.success}" opacity="0.2"/>
  <text x="580" y="235" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Pros</text>
  <text x="580" y="255" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Fine-grained, context-aware</text>
  <text x="580" y="270" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">No role explosion</text>
  
  <rect x="430" y="295" width="300" height="70" rx="4" fill="${C.danger}" opacity="0.2"/>
  <text x="580" y="320" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Cons</text>
  <text x="580" y="340" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Complex policies</text>
  <text x="580" y="355" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Harder to audit, debug</text>
  
  <rect x="430" y="380" width="300" height="60" rx="4" fill="${C.panel2}"/>
  <text x="580" y="405" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Best For</text>
  <text x="580" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Multi-tenant, healthcare, finance, compliance-heavy</text>
  
  <!-- Example Policies -->
  <rect x="50" y="465" width="340" height="80" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="490" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">RBAC Example</text>
  <text x="220" y="515" text-anchor="middle" font-family="monospace" font-size="9" fill="${C.textMuted}">IF user has role "Manager" THEN allow "approve_budget"</text>
  <text x="220" y="535" text-anchor="middle" font-family="monospace" font-size="9" fill="${C.textMuted}">IF user has role "HR" THEN allow "view_salaries"</text>
  
  <rect x="410" y="465" width="340" height="80" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="580" y="490" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">ABAC Example</text>
  <text x="580" y="515" text-anchor="middle" font-family="monospace" font-size="9" fill="${C.textMuted}">ALLOW IF user.department == resource.department</text>
  <text x="580" y="535" text-anchor="middle" font-family="monospace" font-size="9" fill="${C.textMuted}">AND time BETWEEN 09:00 AND 18:00 AND location == "office"</text>
`));

// 4. Access Control Policies
fs.writeFileSync(path.join(DIR, "access-control-policies.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Access Control Policy Models</text>
  
  <!-- DAC -->
  <rect x="50" y="70" width="170" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="135" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">DAC</text>
  <text x="135" y="115" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Discretionary</text>
  
  <rect x="70" y="130" width="130" height="50" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="135" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Owner decides</text>
  <text x="135" y="165" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Unix file perms</text>
  
  <text x="135" y="205" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Flexible</text>
  <text x="135" y="220" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.danger}">✗ Security risks</text>
  <text x="135" y="235" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Personal devices</text>
  
  <!-- MAC -->
  <rect x="240" y="70" width="170" height="180" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="325" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">MAC</text>
  <text x="325" y="115" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Mandatory</text>
  
  <rect x="260" y="130" width="130" height="50" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="325" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">System decides</text>
  <text x="325" y="165" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Classification labels</text>
  
  <text x="325" y="205" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Most secure</text>
  <text x="325" y="220" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.danger}">✗ Inflexible</text>
  <text x="325" y="235" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Military, gov</text>
  
  <!-- RBAC -->
  <rect x="430" y="70" width="170" height="180" rx="8" fill="${C.panel}" stroke="${C.secondary}" stroke-width="2"/>
  <text x="515" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.secondary}">RBAC</text>
  <text x="515" y="115" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Role-Based</text>
  
  <rect x="450" y="130" width="130" height="50" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="515" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Role decides</text>
  <text x="515" y="165" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Job function based</text>
  
  <text x="515" y="205" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Easy management</text>
  <text x="515" y="220" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.warning}">⚠ Role explosion</text>
  <text x="515" y="235" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Enterprise apps</text>
  
  <!-- ABAC -->
  <rect x="620" y="70" width="170" height="180" rx="8" fill="${C.panel}" stroke="${C.primary}" stroke-width="2"/>
  <text x="705" y="95" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.primary}">ABAC</text>
  <text x="705" y="115" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.textMuted}">Attribute-Based</text>
  
  <rect x="640" y="130" width="130" height="50" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="705" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Policy decides</text>
  <text x="705" y="165" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Context-aware</text>
  
  <text x="705" y="205" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">✓ Fine-grained</text>
  <text x="705" y="220" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.danger}">✗ Complex</text>
  <text x="705" y="235" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Cloud, multi-tenant</text>
  
  <!-- Decision Matrix -->
  <rect x="50" y="280" width="740" height="170" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="420" y="305" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Selection Matrix</text>
  
  <rect x="70" y="320" width="160" height="30" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="150" y="340" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Small team, simple</text>
  <text x="280" y="340" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.success}">→ DAC</text>
  
  <rect x="70" y="355" width="160" height="30" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="150" y="375" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Clear org structure</text>
  <text x="280" y="375" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.secondary}">→ RBAC</text>
  
  <rect x="70" y="390" width="160" height="30" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="150" y="410" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">High security needed</text>
  <text x="280" y="410" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.danger}">→ MAC</text>
  
  <rect x="70" y="425" width="160" height="30" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="150" y="445" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Complex, context-aware</text>
  <text x="280" y="445" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.primary}">→ ABAC</text>
  
  <!-- Hybrid approach -->
  <rect x="450" y="320" width="320" height="135" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="610" y="345" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">Hybrid Approach (Recommended)</text>
  <text x="610" y="375" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">RBAC + ABAC combination:</text>
  <text x="610" y="395" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Base access via roles</text>
  <text x="610" y="415" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Fine-tuning via attributes</text>
  <text x="610" y="435" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">• Example: "Manager can approve"</text>
  <text x="610" y="450" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">"IF amount &lt; $10,000 AND dept match"</text>
`));

// 5. Policy Management
fs.writeFileSync(path.join(DIR, "policy-management.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Policy Management Lifecycle</text>
  
  <!-- Create -->
  <rect x="50" y="70" width="140" height="100" rx="8" fill="${C.success}"/>
  <text x="120" y="100" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">1. Create</text>
  <text x="120" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Define policy</text>
  <text x="120" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Business rules</text>
  <text x="120" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Compliance reqs</text>
  
  <line x1="190" y1="120" x2="230" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Review -->
  <rect x="240" y="70" width="140" height="100" rx="8" fill="${C.warning}"/>
  <text x="310" y="100" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.text}">2. Review</text>
  <text x="310" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Security team</text>
  <text x="310" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Legal review</text>
  <text x="310" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.text}">Impact analysis</text>
  
  <line x1="380" y1="120" x2="420" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Test -->
  <rect x="430" y="70" width="140" height="100" rx="8" fill="${C.primary}"/>
  <text x="500" y="100" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">3. Test</text>
  <text x="500" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Staging env</text>
  <text x="500" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Test cases</text>
  <text x="500" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Edge cases</text>
  
  <line x1="570" y1="120" x2="610" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <!-- Deploy -->
  <rect x="620" y="70" width="140" height="100" rx="8" fill="${C.secondary}"/>
  <text x="690" y="100" text-anchor="middle" font-family="system-ui" font-size="13" font-weight="bold" fill="${C.bg}">4. Deploy</text>
  <text x="690" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Rollout</text>
  <text x="690" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Version control</text>
  <text x="690" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">Audit trail</text>
  
  <!-- Policy Engine -->
  <rect x="50" y="210" width="340" height="240" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="220" y="240" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Policy Engine (PDP)</text>
  
  <rect x="70" y="260" width="300" height="50" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="220" y="280" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Policy Decision Point</text>
  <text x="220" y="300" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Evaluates policies against requests</text>
  
  <rect x="70" y="320" width="300" height="50" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="220" y="340" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Policy Information Point</text>
  <text x="220" y="360" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Fetches attributes (user, resource, context)</text>
  
  <rect x="70" y="380" width="300" height="50" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="220" y="400" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.text}">Policy Administration Point</text>
  <text x="220" y="420" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Policy creation, update, deletion</text>
  
  <!-- Policy Storage -->
  <rect x="420" y="210" width="330" height="120" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="585" y="240" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Policy Storage (PRP)</text>
  
  <rect x="440" y="260" width="290" height="30" rx="4" fill="${C.panel2}"/>
  <text x="585" y="280" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Policy Repository (Git/DB)</text>
  
  <rect x="440" y="295" width="290" height="30" rx="4" fill="${C.panel2}"/>
  <text x="585" y="315" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Version History</text>
  
  <rect x="440" y="330" width="290" height="30" rx="4" fill="${C.panel2}"/>
  <text x="585" y="350" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Policy Templates</text>
  
  <!-- Enforcement -->
  <rect x="420" y="350" width="330" height="100" rx="8" fill="${C.panel}" stroke="${C.success}" stroke-width="2"/>
  <text x="585" y="380" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Policy Enforcement (PEP)</text>
  
  <rect x="440" y="400" width="290" height="40" rx="4" fill="${C.success}" opacity="0.3"/>
  <text x="585" y="415" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">API Gateway / Middleware</text>
  <text x="585" y="430" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Intercepts requests, enforces decisions</text>
`));

// 6. Policy Evaluation
fs.writeFileSync(path.join(DIR, "policy-evaluation.svg"), svg(`
  <text x="400" y="30" text-anchor="middle" font-family="system-ui" font-size="18" font-weight="bold" fill="${C.text}">Policy Evaluation Flow</text>
  
  <!-- Request -->
  <rect x="50" y="80" width="120" height="80" rx="8" fill="${C.primary}"/>
  <text x="110" y="115" text-anchor="middle" font-family="system-ui" font-size="11" font-weight="bold" fill="${C.bg}">Access Request</text>
  <text x="110" y="140" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.bg}">user, resource</text>
  
  <!-- PEP -->
  <rect x="220" y="70" width="140" height="100" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="290" y="100" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">PEP</text>
  <text x="290" y="125" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Policy Enforcement</text>
  <text x="290" y="145" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Intercept &amp; Enforce</text>
  <text x="290" y="160" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Point</text>
  
  <!-- PDP -->
  <rect x="410" y="60" width="180" height="120" rx="8" fill="${C.panel}" stroke="${C.warning}" stroke-width="2"/>
  <text x="500" y="90" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">PDP</text>
  <text x="500" y="115" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Policy Decision</text>
  <text x="500" y="135" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Evaluate policies</text>
  <text x="500" y="155" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Return Allow/Deny</text>
  <text x="500" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Point</text>
  
  <!-- PIP -->
  <rect x="640" y="80" width="120" height="80" rx="8" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>
  <text x="700" y="110" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">PIP</text>
  <text x="700" y="135" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Policy Information</text>
  <text x="700" y="150" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Fetch attributes</text>
  
  <!-- Attribute Sources -->
  <rect x="640" y="200" width="120" height="60" rx="4" fill="${C.panel2}" stroke="${C.border}" stroke-width="1"/>
  <text x="700" y="225" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">User DB</text>
  
  <rect x="520" y="220" width="100" height="40" rx="4" fill="${C.panel2}" stroke="${C.border}" stroke-width="1"/>
  <text x="570" y="245" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Resource DB</text>
  
  <rect x="410" y="240" width="90" height="40" rx="4" fill="${C.panel2}" stroke="${C.border}" stroke-width="1"/>
  <text x="455" y="265" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Context</text>
  
  <!-- Policy Store -->
  <rect x="220" y="220" width="140" height="80" rx="8" fill="${C.panel}" stroke="${C.secondary}" stroke-width="2"/>
  <text x="290" y="250" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="bold" fill="${C.text}">Policy Store</text>
  <text x="290" y="275" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">XACML/Rego</text>
  <text x="290" y="290" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">policies</text>
  
  <!-- Arrows -->
  <line x1="170" y1="120" x2="210" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="190" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">1. Request</text>
  
  <line x1="360" y1="120" x2="400" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="380" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">2. Evaluate</text>
  
  <line x1="590" y1="120" x2="630" y2="120" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="610" y="110" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">3. Get attrs</text>
  
  <line x1="700" y1="160" x2="700" y2="190" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <line x1="630" y1="230" x2="500" y2="180" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="510" y1="230" x2="500" y2="180" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="460" y1="230" x2="500" y2="180" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  
  <line x1="410" y1="120" x2="360" y2="200" stroke="${C.textMuted}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="385" y="160" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.textMuted}">4. Load policies</text>

  <line x1="360" y1="150" x2="400" y2="150" stroke="${C.success}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="380" y="165" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.success}">5. Decision</text>
  
  <line x1="210" y1="150" x2="170" y2="150" stroke="${C.success}" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="190" y="165" text-anchor="middle" font-family="system-ui" font-size="8" fill="${C.success}">6. Allow/Deny</text>
  
  <!-- Decision Logic -->
  <rect x="50" y="320" width="700" height="130" rx="8" fill="${C.panel2}" stroke="${C.border}" stroke-width="2"/>
  <text x="400" y="345" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="bold" fill="${C.text}">Decision Logic</text>
  
  <rect x="80" y="365" width="170" height="70" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="165" y="390" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Permit</text>
  <text x="165" y="410" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">All conditions met</text>
  <text x="165" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.success}">→ Allow access</text>
  
  <rect x="270" y="365" width="170" height="70" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="355" y="390" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Deny</text>
  <text x="355" y="410" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Condition failed</text>
  <text x="355" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.danger}">→ Block access</text>
  
  <rect x="460" y="365" width="170" height="70" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="545" y="390" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Indeterminate</text>
  <text x="545" y="410" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">Error evaluating</text>
  <text x="545" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.warning}">→ Default deny</text>
  
  <rect x="650" y="365" width="80" height="70" rx="4" fill="${C.bg}" stroke="${C.border}" stroke-width="1"/>
  <text x="690" y="395" text-anchor="middle" font-family="system-ui" font-size="10" fill="${C.text}">Not Applicable</text>
  <text x="690" y="425" text-anchor="middle" font-family="system-ui" font-size="9" fill="${C.textMuted}">→ Next policy</text>
`));

console.log("✅ Batch 3 complete: 6 Authorization & RBAC diagrams created");
