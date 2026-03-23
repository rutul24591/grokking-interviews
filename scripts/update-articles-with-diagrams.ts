#!/usr/bin/env node
/**
 * Update Identity & Access Articles with 3 Diagrams Each
 */

import * as fs from "fs";
import * as path from "path";

const ARTICLES_DIR = "content/articles/requirements/functional-requirements/identity-access";

// Map each article to its 3 diagrams
const articleDiagrams: Record<string, string[]> = {
  "access-control-policies.tsx": [
    "access-control-policies.svg",
    "policy-evaluation.svg",
    "policy-management.svg"
  ],
  "account-lockout.tsx": [
    "account-lockout-flow.svg",
    "account-lockout-unlock.svg",
    "account-lockout-security.svg"
  ],
  "account-recovery-ui.tsx": [
    "account-recovery-flow.svg",
    "account-recovery-options.svg",
    "account-recovery-security.svg"
  ],
  "account-settings-ui.tsx": [
    "account-settings-flow.svg",
    "account-settings-gdpr.svg",
    "account-settings-security.svg"
  ],
  "account-verification.tsx": [
    "account-verification-flow.svg",
    "verification-token-flow.svg",
    "account-verification-security.svg"
  ],
  "authentication-audit-logs.tsx": [
    "auth-audit-logs.svg",
    "auth-audit-schema.svg",
    "auth-audit-analysis.svg"
  ],
  "authentication-service.tsx": [
    "authentication-service-architecture.svg",
    "token-management.svg",
    "auth-scalability.svg"
  ],
  "credential-rotation.tsx": [
    "credential-rotation-flow.svg",
    "token-rotation.svg",
    "credential-rotation-security.svg"
  ],
  "device-session-management-ui.tsx": [
    "device-session-management.svg",
    "device-session-security.svg",
    "device-session-tracking.svg"
  ],
  "device-session-tracking.tsx": [
    "device-session-tracking.svg",
    "session-metadata.svg",
    "device-tracking-security.svg"
  ],
  "email-verification.tsx": [
    "email-verification-flow.svg",
    "email-verification-security.svg",
    "email-verification-ux.svg"
  ],
  "identity-providers.tsx": [
    "identity-providers.svg",
    "idp-integration.svg",
    "idp-enterprise.svg"
  ],
  "login-attempt-tracking.tsx": [
    "login-attempt-tracking.svg",
    "login-threat-detection.svg",
    "login-tracking-implementation.svg"
  ],
  "login-interface.tsx": [
    "login-interface-flow.svg",
    "login-security.svg",
    "login-ux-patterns.svg"
  ],
  "logout.tsx": [
    "logout-flow.svg",
    "logout-patterns.svg",
    "logout-security.svg"
  ],
  "mfa-setup.tsx": [
    "mfa-setup-flow.svg",
    "mfa-methods.svg",
    "mfa-recovery.svg"
  ],
  "oauth-providers.tsx": [
    "oauth-flow.svg",
    "oauth-providers.svg",
    "oauth-security.svg"
  ],
  "password-hashing-and-validation.tsx": [
    "password-hashing-flow.svg",
    "password-validation.svg",
    "password-algorithms.svg"
  ],
  "password-reset.tsx": [
    "password-reset-flow.svg",
    "password-reset-security.svg",
    "password-reset-ux.svg"
  ],
  "permission-validation.tsx": [
    "permission-validation-flow.svg",
    "resource-permissions.svg",
    "permission-caching.svg"
  ],
  "phone-verification.tsx": [
    "phone-verification-flow.svg",
    "phone-verification-methods.svg",
    "phone-verification-security.svg"
  ],
  "profile-settings-ui.tsx": [
    "profile-settings-flow.svg",
    "profile-avatar-management.svg",
    "profile-privacy.svg"
  ],
  "rbac.tsx": [
    "rbac-model.svg",
    "rbac-schema.svg",
    "rbac-vs-abac.svg"
  ],
  "security-audit-logging.tsx": [
    "security-audit-logging.svg",
    "audit-event-schema.svg",
    "audit-compliance.svg"
  ],
  "security-settings-ui.tsx": [
    "security-settings-dashboard.svg",
    "security-mfa-management.svg",
    "security-recommendations.svg"
  ],
  "session-management.tsx": [
    "session-management-flow.svg",
    "session-lifecycle.svg",
    "session-scalability.svg"
  ],
  "session-persistence.tsx": [
    "session-persistence-flow.svg",
    "session-token-refresh.svg",
    "session-security.svg"
  ],
  "session-revocation.tsx": [
    "session-revocation-flow.svg",
    "session-revocation-patterns.svg",
    "session-revocation-distributed.svg"
  ],
  "signup-interface.tsx": [
    "signup-interface-flow.svg",
    "signup-patterns.svg",
    "signup-security.svg"
  ],
  "social-login-options.tsx": [
    "social-login-flow.svg",
    "social-account-linking.svg",
    "social-login-conversion.svg"
  ],
  "sso-integrations.tsx": [
    "sso-flow.svg",
    "saml-flow.svg",
    "sso-enterprise.svg"
  ],
  "token-generation.tsx": [
    "token-generation-flow.svg",
    "jwt-structure.svg",
    "token-security.svg"
  ],
  "user-registration-service.tsx": [
    "user-registration-flow.svg",
    "registration-validation.svg",
    "registration-scalability.svg"
  ],
};

// Diagram captions
const diagramCaptions: Record<string, string> = {
  "access-control-policies.svg": "Access Control Policies — comparing DAC, MAC, RBAC, and ABAC models with selection matrix",
  "policy-evaluation.svg": "Policy Evaluation — XACML-style flow with PEP, PDP, PIP components and decision logic",
  "policy-management.svg": "Policy Management — lifecycle from creation to deployment with policy engine components",
  "account-lockout-flow.svg": "Account Lockout Flow — showing failed attempts, lockout trigger, and unlock process",
  "account-lockout-unlock.svg": "Account Unlock — showing admin unlock, self-service unlock, and automatic expiry",
  "account-lockout-security.svg": "Account Lockout Security — showing DoS prevention, progressive delays, and CAPTCHA integration",
  "account-recovery-flow.svg": "Account Recovery Flow — showing identity verification, reset options, and account restoration",
  "account-recovery-options.svg": "Account Recovery Options — comparing backup codes, recovery email, phone, and support ticket",
  "account-recovery-security.svg": "Account Recovery Security — showing waiting periods, notifications, and audit trails",
  "account-settings-flow.svg": "Account Settings Flow — showing settings management, privacy controls, and data export",
  "account-settings-gdpr.svg": "Account Settings GDPR — showing data access, portability, right to be forgotten",
  "account-settings-security.svg": "Account Settings Security — showing password change, session management, and security alerts",
  "account-verification-flow.svg": "Account Verification Flow — showing verification requirements, document upload, and approval",
  "verification-token-flow.svg": "Verification Token Flow — showing token generation, delivery, validation, and expiry",
  "account-verification-security.svg": "Account Verification Security — showing fraud detection, document validation, and manual review",
  "auth-audit-logs.svg": "Auth Audit Logs — showing log structure, retention, and search capabilities",
  "auth-audit-schema.svg": "Auth Audit Schema — showing database schema for authentication events",
  "auth-audit-analysis.svg": "Auth Audit Analysis — showing anomaly detection, threat hunting, and compliance reporting",
  "authentication-service-architecture.svg": "Authentication Service Architecture — showing service components, data flow, and integrations",
  "token-management.svg": "Token Management — showing token lifecycle, storage, and rotation strategies",
  "auth-scalability.svg": "Auth Scalability — showing horizontal scaling, caching strategies, and load distribution",
  "credential-rotation-flow.svg": "Credential Rotation Flow — showing scheduled rotation, compromise-triggered rotation, and validation",
  "token-rotation.svg": "Token Rotation — showing refresh token rotation, invalidation, and reuse detection",
  "credential-rotation-security.svg": "Credential Rotation Security — showing old credential invalidation and grace periods",
  "device-session-management.svg": "Device Session Management — showing device registration, trust levels, and session binding",
  "device-session-security.svg": "Device Session Security — showing device fingerprinting, anomaly detection, and revocation",
  "device-session-tracking.svg": "Device Session Tracking — showing device metadata, location tracking, and activity logs",
  "device-tracking-security.svg": "Device Tracking Security — showing privacy controls, consent management, and data retention",
  "email-verification-flow.svg": "Email Verification Flow — showing token generation, email delivery, verification, and account activation",
  "email-verification-security.svg": "Email Verification Security — showing token hashing, rate limiting, email bombing prevention, and enumeration protection",
  "email-verification-ux.svg": "Email Verification UX — showing resend flow, expired token handling, and user-friendly error states",
  "identity-providers.svg": "Identity Providers — comparing social, enterprise, and government identity providers",
  "idp-integration.svg": "IdP Integration — showing protocol integration, attribute mapping, and trust configuration",
  "idp-enterprise.svg": "Enterprise IdP — showing Azure AD, Okta, OneLogin integration patterns",
  "login-attempt-tracking.svg": "Login Attempt Tracking — showing Redis-based rate limiting and attempt logging",
  "login-threat-detection.svg": "Login Threat Detection — showing risk signals, scoring engine, and adaptive responses",
  "login-tracking-implementation.svg": "Login Tracking Implementation — showing detailed tracking schema and analysis",
  "login-interface-flow.svg": "Login Interface Flow — showing authentication methods, MFA challenge, session creation, and redirect",
  "login-security.svg": "Login Security Layers — showing threats, defenses, monitoring, and TLS protection",
  "login-ux-patterns.svg": "Login UX Patterns — comparing traditional, social, passwordless, biometric, SSO, and adaptive MFA",
  "logout-flow.svg": "Logout Flow — showing token invalidation, session cleanup, and redirect",
  "logout-patterns.svg": "Logout Patterns — comparing local, global, and federated logout",
  "logout-security.svg": "Logout Security — showing CSRF protection, token blacklisting, and device-specific logout",
  "mfa-setup-flow.svg": "MFA Setup Flow — showing method selection, QR code generation, verification, and backup codes",
  "mfa-methods.svg": "MFA Methods — comparing knowledge, possession, inherence factors with security ranking",
  "mfa-recovery.svg": "MFA Recovery — showing recovery options, backup codes, and best practices",
  "oauth-flow.svg": "OAuth Flow — showing authorization code flow with PKCE",
  "oauth-providers.svg": "OAuth Providers — comparing Google, GitHub, Microsoft, and other providers",
  "oauth-security.svg": "OAuth Security — showing state parameter, PKCE, scope validation, and token handling",
  "password-hashing-flow.svg": "Password Hashing Flow — showing registration and login flows with bcrypt/Argon2",
  "password-validation.svg": "Password Validation — showing rules, strength meter, blocked passwords, and NIST guidelines",
  "password-algorithms.svg": "Password Algorithms — comparing Argon2, bcrypt, scrypt, and PBKDF2",
  "password-reset-flow.svg": "Password Reset Flow — showing token generation, email delivery, and password update",
  "password-reset-security.svg": "Password Reset Security — showing token hashing, rate limiting, and session invalidation",
  "password-reset-ux.svg": "Password Reset UX — showing user-friendly flows, error states, and confirmation",
  "permission-validation-flow.svg": "Permission Validation Flow — showing request interception, policy evaluation, and enforcement",
  "resource-permissions.svg": "Resource Permissions — showing ownership, sharing, and access levels",
  "permission-caching.svg": "Permission Caching — showing cache strategies, invalidation, and consistency",
  "phone-verification-flow.svg": "Phone Verification Flow — showing SMS code delivery, validation, and account linking",
  "phone-verification-methods.svg": "Phone Verification Methods — comparing SMS, voice call, and WhatsApp",
  "phone-verification-security.svg": "Phone Verification Security — showing SIM swap detection, rate limiting, and country restrictions",
  "profile-settings-flow.svg": "Profile Settings Flow — showing profile update, avatar management, and privacy settings",
  "profile-avatar-management.svg": "Profile Avatar Management — showing upload, cropping, and CDN delivery",
  "profile-privacy.svg": "Profile Privacy — showing visibility controls, data sharing, and GDPR compliance",
  "rbac-model.svg": "RBAC Model — showing Users → Roles → Permissions flow with role hierarchy",
  "rbac-schema.svg": "RBAC Schema — showing database schema with users, roles, permissions tables",
  "rbac-vs-abac.svg": "RBAC vs ABAC — side-by-side comparison with pros, cons, and example policies",
  "security-audit-logging.svg": "Security Audit Logging — showing event capture, storage, and alerting",
  "audit-event-schema.svg": "Audit Event Schema — showing standardized event structure and fields",
  "audit-compliance.svg": "Audit Compliance — showing SOC2, ISO27001, and GDPR compliance mapping",
  "security-settings-dashboard.svg": "Security Settings Dashboard — showing centralized security management UI",
  "security-mfa-management.svg": "Security MFA Management — showing MFA enrollment, recovery, and device management",
  "security-recommendations.svg": "Security Recommendations — showing adaptive security suggestions based on user behavior",
  "session-management-flow.svg": "Session Management Flow — showing session creation, validation, and cleanup across services",
  "session-lifecycle.svg": "Session Lifecycle — showing Create → Active → Idle → Expired with timeline",
  "session-scalability.svg": "Session Scalability — showing distributed session storage and horizontal scaling",
  "session-persistence-flow.svg": "Session Persistence Flow — comparing server-side, JWT, and hybrid approaches",
  "session-token-refresh.svg": "Session Token Refresh — showing access/refresh token flow with rotation",
  "session-security.svg": "Session Security — showing cookie security, token security, attack prevention, and anomaly detection",
  "session-revocation-flow.svg": "Session Revocation Flow — showing user-initiated and admin-initiated revocation",
  "session-revocation-patterns.svg": "Session Revocation Patterns — comparing single, bulk, and distributed revocation",
  "session-revocation-distributed.svg": "Session Revocation Distributed — showing distributed cache invalidation and propagation",
  "signup-interface-flow.svg": "Signup Interface Flow — showing registration methods, validation, and account creation",
  "signup-patterns.svg": "Signup Patterns — comparing email, social, SSO, and passwordless signup",
  "signup-security.svg": "Signup Security — showing bot prevention, email validation, and abuse detection",
  "social-login-flow.svg": "Social Login Flow — showing OAuth flow, account linking, and profile import",
  "social-account-linking.svg": "Social Account Linking — showing multiple provider linking and conflict resolution",
  "social-login-conversion.svg": "Social Login Conversion — showing conversion optimization and provider selection",
  "sso-flow.svg": "SSO Flow — showing SAML and OIDC flows with IdP integration",
  "saml-flow.svg": "SAML Flow — showing SAML assertion exchange between IdP and SP",
  "sso-enterprise.svg": "SSO Enterprise — showing enterprise SSO with SCIM provisioning and directory sync",
  "token-generation-flow.svg": "Token Generation Flow — showing JWT creation, signing, and delivery",
  "jwt-structure.svg": "JWT Structure — showing header, payload, signature with claims",
  "token-security.svg": "Token Security — showing signing algorithms, expiry, and revocation",
  "user-registration-flow.svg": "User Registration Flow — showing signup, validation, and account creation",
  "registration-validation.svg": "Registration Validation — showing input validation, duplicate detection, and fraud prevention",
  "registration-scalability.svg": "Registration Scalability — showing horizontal scaling, queue-based processing, and rate limiting",
};

function updateArticle(articleFile: string, diagrams: string[]) {
  const filePath = path.join(ARTICLES_DIR, articleFile);
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Find the first ArticleImage and replace it with all three
  const firstImageMatch = content.match(/<ArticleImage[\s\S]*?\/>/);
  if (!firstImageMatch) {
    console.log(`⚠️  No ArticleImage found in ${articleFile}`);
    return false;
  }
  
  // Generate three ArticleImage components
  const imageComponents = diagrams.map((diagram, index) => {
    const caption = diagramCaptions[diagram] || `Diagram ${index + 1} for ${articleFile}`;
    const altText = diagram.replace(".svg", "").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    
    return `<ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/${diagram}"
          alt="${altText}"
          caption="${caption}"
        />`;
  }).join("\n\n        ");
  
  // Replace the first image with all three
  content = content.replace(/<ArticleImage[\s\S]*?\/>/, imageComponents);
  
  fs.writeFileSync(filePath, content, "utf-8");
  return true;
}

console.log("=".repeat(80));
console.log("UPDATING IDENTITY & ACCESS ARTICLES WITH 3 DIAGRAMS EACH");
console.log("=".repeat(80));
console.log("");

let updated = 0;
let errors = 0;

for (const [article, diagrams] of Object.entries(articleDiagrams)) {
  const success = updateArticle(article, diagrams);
  if (success) {
    console.log(`✅ ${article} - ${diagrams.length} diagrams`);
    updated++;
  } else {
    console.log(`❌ ${article} - Failed`);
    errors++;
  }
}

console.log("");
console.log("=".repeat(80));
console.log("SUMMARY");
console.log("=".repeat(80));
console.log(`Articles updated: ${updated}`);
console.log(`Errors: ${errors}`);
console.log(`Total diagrams added: ${updated * 3}`);
console.log("");
