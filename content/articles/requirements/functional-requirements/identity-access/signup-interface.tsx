"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-signup-interface",
  title: "Signup Interface",
  description: "Comprehensive guide to designing signup interfaces covering form design, validation, progressive profiling, bot prevention, and conversion optimization for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "signup-interface",
  version: "extensive",
  wordCount: 8000,
  readingTime: 32,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "signup", "registration", "frontend", "ux"],
  relatedTopics: ["login-interface", "email-verification", "password-reset", "social-login"],
};

export default function SignupInterfaceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Signup Interface</strong> (also called Registration or Sign-up) is the primary 
          entry point for new users to create an account on a platform. It is often the first 
          meaningful interaction a user has with your product, making it critical for conversion 
          optimization and setting the tone for the user experience.
        </p>
        <p>
          For staff and principal engineers, designing a signup interface requires balancing multiple 
          competing concerns: minimizing friction to maximize conversion, collecting sufficient 
          information for personalization and security, preventing abuse (bot registrations, fake 
          accounts), and ensuring accessibility across devices and user abilities. The signup flow 
          also sets expectations for data privacy and establishes the foundation for the user's 
          relationship with the platform.
        </p>
        <p>
          Modern signup interfaces have evolved significantly: from simple email/password forms to 
          multi-step wizards with progressive profiling, from synchronous validation to real-time 
          feedback, from single-method registration to multi-option signup (email, phone, social, 
          SSO). The technical complexity has also increased with requirements for bot prevention 
          (CAPTCHA, device fingerprinting), email/phone verification, password strength enforcement, 
          and compliance with regulations (GDPR consent, age verification).
        </p>
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready signup interface must satisfy functional, security, and UX requirements 
          while maintaining high conversion rates.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Form Design Requirements</h3>
          <ul className="space-y-3">
            <li>
              <strong>Minimal Fields:</strong> Request only essential information initially 
              (email/phone, password). Additional fields (name, profile info) can be collected 
              post-signup through progressive profiling. Each additional field reduces conversion 
              by 5-15%.
            </li>
            <li>
              <strong>Clear Labels:</strong> Use descriptive labels above input fields (not 
              placeholder-only labels). Include required field indicators (*). Provide helper 
              text for complex fields (password requirements).
            </li>
            <li>
              <strong>Input Types:</strong> Use appropriate HTML input types (type="email", 
              type="tel", type="password") for mobile keyboard optimization and browser 
              autofill support.
            </li>
            <li>
              <strong>Autocomplete Attributes:</strong> Include autocomplete="email", 
              autocomplete="new-password" for browser password manager integration and 
              reduced friction.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Validation Requirements</h3>
          <ul className="space-y-3">
            <li>
              <strong>Real-time Validation:</strong> Validate fields on blur (not on every 
              keystroke). Show inline error messages below the field. Use green checkmarks 
              for valid fields to provide positive feedback.
            </li>
            <li>
              <strong>Email Validation:</strong> Check format (regex), check domain existence 
              (MX record lookup via API), check for disposable email providers. Avoid syntax 
              errors but don't be overly restrictive (allow + aliases, international domains).
            </li>
            <li>
              <strong>Password Validation:</strong> Enforce minimum length (8+ characters per 
              NIST). Show password strength meter. Provide clear requirements (no obscure 
              composition rules). Check against breached password lists (Have I Been Pwned API).
            </li>
            <li>
              <strong>Username Validation:</strong> Check availability in real-time (debounced 
              API call). Validate format (alphanumeric, underscores, 3-30 chars). Reserve 
              admin/special names.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Bot Prevention</h3>
          <ul className="space-y-3">
            <li>
              <strong>Invisible CAPTCHA:</strong> Use reCAPTCHA v3 or hCaptcha for invisible 
              bot detection. Only show challenge for suspicious traffic (score {'<'} 0.5). 
              Avoid interrupting legitimate users.
            </li>
            <li>
              <strong>Honeypot Fields:</strong> Add hidden fields that bots fill but humans 
              don't see. Reject submissions with honeypot values. Zero friction for real users.
            </li>
            <li>
              <strong>Rate Limiting:</strong> Limit signups per IP (5/hour), per email domain, 
              per device fingerprint. Return generic errors to prevent email enumeration.
            </li>
            <li>
              <strong>Device Fingerprinting:</strong> Collect browser/device signals for fraud 
              detection. Flag suspicious patterns (headless browsers, known bot signatures).
            </li>
          </ul>
        </div>

        <ArticleImage
          src="/diagrams/requirements/identity-access/signup-flow-diagram.svg"
          alt="Signup Interface Flow Diagram"
          caption="Complete signup flow showing form submission, validation, bot checks, email verification, and account creation"
        />
      </section>

      <section>
        <h2>Implementation Patterns</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/signup-patterns.svg"
          alt="Signup Implementation Patterns"
          caption="Implementation — showing single-page, multi-step, social signup, and SSO patterns"
        />

        <p>
          Several patterns have emerged for signup interfaces, each with trade-offs for conversion,
          security, and user experience.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Single-Page vs Multi-Step</h3>
          <ul className="space-y-3">
            <li>
              <strong>Single-Page Signup:</strong> All fields on one page. Pros: users see 
              total commitment, faster for short forms. Cons: overwhelming for many fields, 
              higher abandonment. Best for: 3-5 fields maximum.
            </li>
            <li>
              <strong>Multi-Step Wizard:</strong> Break into logical steps (Account → Profile 
              → Preferences). Pros: reduces cognitive load, progress indicator motivates 
              completion, can skip optional steps. Cons: more clicks, users may not see full 
              commitment. Best for: 6+ fields or complex flows.
            </li>
            <li>
              <strong>Progressive Profiling:</strong> Collect minimal info at signup, gather 
              more over time through engagement. Pros: lowest friction, highest conversion. 
              Cons: incomplete profiles initially, requires follow-up engagement. Best for: 
              consumer apps, social platforms.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Social Signup Integration</h3>
          <ul className="space-y-3">
            <li>
              <strong>Social Buttons:</strong> Prominent placement above or below email form. 
              Use official brand assets (Google, Facebook, Apple buttons). Show what permissions 
              will be requested. Track which provider converts best.
            </li>
            <li>
              <strong>Account Linking:</strong> If social email matches existing account, prompt 
              to link (verify password first). Allow multiple social providers per account. 
              Show connected accounts in settings.
            </li>
            <li>
              <strong>Fallback Email:</strong> Even with social signup, collect email as backup 
              contact method. Some providers don't share email by default (require scope request).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Conversion Optimization</h3>
          <ul className="space-y-3">
            <li>
              <strong>Value Proposition:</strong> Show benefits near signup ("Join 10M+ users", 
              "Free forever", "No credit card required"). Address objections proactively.
            </li>
            <li>
              <strong>Social Proof:</strong> Display user count, testimonials, trust badges 
              (security certifications, press logos). Reduce signup anxiety.
            </li>
            <li>
              <strong>Reduce Friction:</strong> Enable password visibility toggle. Auto-focus 
              first field. Support Enter key to submit. Show clear error messages. Preserve 
              form data on error.
            </li>
            <li>
              <strong>Mobile Optimization:</strong> Large touch targets (44px minimum). Mobile 
              keyboard optimization (email type, tel type). Avoid horizontal scrolling. Test 
              on real devices.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Accessibility Requirements</h2>
        <p>
          Signup interfaces must be accessible to all users, including those using assistive 
          technologies. This is both an ethical requirement and often a legal one (ADA, WCAG).
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">WCAG Compliance</h3>
          <ul className="space-y-3">
            <li>
              <strong>Label Association:</strong> Use {'<label for="id">'} explicitly associated 
              with inputs. Never rely on placeholder as label. Screen readers need proper labels.
            </li>
            <li>
              <strong>Error Announcements:</strong> Use aria-live="polite" for error messages. 
              Associate errors with inputs via aria-describedby. Announce form submission errors.
            </li>
            <li>
              <strong>Focus Management:</strong> Visible focus indicators (outline). Logical 
              tab order. Move focus to first error on submit failure. Don't trap focus.
            </li>
            <li>
              <strong>Color Independence:</strong> Don't rely solely on color for validation 
              (red/green). Use icons and text. Maintain contrast ratios (4.5:1 minimum).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/signup-security.svg"
          alt="Signup Security Considerations"
          caption="Security — showing bot prevention, email enumeration protection, and rate limiting"
        />

        <p>
          Signup interfaces are attack vectors for account takeover, credential stuffing, and
          user enumeration. Security must be built in from the start.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Preventing Attacks</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email Enumeration:</strong> Use generic messages ("If this email exists, 
              we'll send a confirmation"). Don't reveal if email is registered during signup 
              or password reset.
            </li>
            <li>
              <strong>Credential Stuffing:</strong> Rate limit by IP and device. Check passwords 
              against breach databases. Require CAPTCHA for suspicious patterns.
            </li>
            <li>
              <strong>HTTPS Enforcement:</strong> Serve signup page over HTTPS only. Use HSTS 
              headers. Never transmit credentials over HTTP.
            </li>
            <li>
              <strong>CSRF Protection:</strong> Include CSRF token in signup form. Validate on
              server. Prevent cross-site request forgery attacks.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Technical Implementation</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Form Validation</h3>
        <p>
          Implement client-side validation for immediate feedback. Validate email format with regex, check password length (minimum 8 characters per NIST), verify password confirmation matches. Show inline error messages below each field. Use debounced API calls for real-time username/email availability checks. Preserve form data on validation errors to avoid frustrating re-entry.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">State Management</h3>
        <p>
          Use local component state for form data and errors. Store access tokens in memory (not localStorage) after successful signup. Handle MFA redirects by navigating to verification page with session ID. Implement retry logic with exponential backoff for transient API failures. Clear sensitive data on navigation away from signup.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Verification Flow</h3>
        <p>
          Send verification email immediately after signup. Use signed tokens with short expiry (24 hours). Allow limited app access before verification with restrictions (no payments, limited actions). Show persistent reminder banner to verify email. Implement rate limiting for resend verification (max 3/hour). Expire unverified accounts after 7 days to reduce database bloat.
        </p>
      </section>

      <section>
        <h2>Metrics &amp; Monitoring</h2>
        <p>
          Track these key metrics to measure signup performance and identify optimization
          opportunities:
        </p>
        <ul className="space-y-2">
          <li><strong>Signup Conversion Rate:</strong> Visitors who complete signup / Total visitors</li>
          <li><strong>Funnel Drop-off:</strong> Abandonment rate per step (identify friction points)</li>
          <li><strong>Time to Complete:</strong> Average time from start to submit</li>
          <li><strong>Validation Errors:</strong> Most common error types (improve UX)</li>
          <li><strong>Email Verification Rate:</strong> Users who verify email / Total signups</li>
          <li><strong>Social Signup %:</strong> Signups via social / Total signups</li>
          <li><strong>Bot Detection Rate:</strong> Blocked signups / Total signup attempts</li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Form Design</h3>
        <ul className="space-y-2">
          <li>Minimize required fields (email + password only for initial signup)</li>
          <li>Use clear, descriptive labels above input fields</li>
          <li>Provide real-time validation with helpful error messages</li>
          <li>Support password visibility toggle</li>
          <li>Enable autocomplete attributes for password managers</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bot Prevention</h3>
        <ul className="space-y-2">
          <li>Use invisible CAPTCHA (reCAPTCHA v3, hCaptcha)</li>
          <li>Implement honeypot fields for zero-friction bot detection</li>
          <li>Rate limit by IP, device, and email domain</li>
          <li>Collect device fingerprints for fraud detection</li>
          <li>Verify email before full account activation</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Conversion Optimization</h3>
        <ul className="space-y-2">
          <li>Show clear value proposition near signup form</li>
          <li>Display social proof (user count, testimonials)</li>
          <li>Offer multiple signup options (email, social, SSO)</li>
          <li>Use progress indicators for multi-step flows</li>
          <li>A/B test form variations continuously</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Accessibility</h3>
        <ul className="space-y-2">
          <li>Associate labels explicitly with inputs</li>
          <li>Use aria-live for error announcements</li>
          <li>Provide visible focus indicators</li>
          <li>Ensure color-independent validation</li>
          <li>Test with screen readers (NVDA, VoiceOver)</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Too many required fields:</strong> Each additional field reduces conversion by 5-15%.
            <br /><strong>Fix:</strong> Request only email and password initially. Use progressive profiling for additional data.
          </li>
          <li>
            <strong>Placeholder-only labels:</strong> Placeholders disappear on focus, confusing users.
            <br /><strong>Fix:</strong> Use explicit labels above fields. Placeholders for examples only.
          </li>
          <li>
            <strong>Revealing existing accounts:</strong> "Email already registered" allows email enumeration.
            <br /><strong>Fix:</strong> Use generic messages ("If this email exists, we'll send confirmation").
          </li>
          <li>
            <strong>Complex password rules:</strong> Obscure requirements frustrate users.
            <br /><strong>Fix:</strong> Follow NIST guidelines (8+ chars, no composition rules). Show strength meter.
          </li>
          <li>
            <strong>No bot prevention:</strong> Allows fake account creation at scale.
            <br /><strong>Fix:</strong> Implement invisible CAPTCHA, honeypot fields, rate limiting.
          </li>
          <li>
            <strong>Blocking paste in password field:</strong> Prevents password manager usage.
            <br /><strong>Fix:</strong> Allow paste. Password managers improve security.
          </li>
          <li>
            <strong>No email verification:</strong> Allows fake emails and abuse.
            <br /><strong>Fix:</strong> Send verification email. Limit functionality until verified.
          </li>
          <li>
            <strong>Poor mobile experience:</strong> Small touch targets, wrong keyboard types.
            <br /><strong>Fix:</strong> 44px minimum targets. Use type="email", type="tel". Test on devices.
          </li>
          <li>
            <strong>No social signup options:</strong> Misses conversion opportunity.
            <br /><strong>Fix:</strong> Offer Google, Apple, Facebook signup. Track provider performance.
          </li>
          <li>
            <strong>Not preserving form data on error:</strong> Users must re-enter everything.
            <br /><strong>Fix:</strong> Preserve valid fields. Only clear password fields. Show specific errors.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Progressive Profiling</h3>
        <p>
          Collect user information gradually over multiple interactions instead of all at signup.
        </p>
        <ul className="space-y-2">
          <li><strong>Initial Signup:</strong> Email and password only. Lowest friction, highest conversion.</li>
          <li><strong>Post-Signup:</strong> Request name, profile picture during onboarding flow.</li>
          <li><strong>Engagement-Based:</strong> Ask for phone number when enabling 2FA. Request company info when upgrading.</li>
          <li><strong>Contextual:</strong> Ask for interests when personalizing feed. Request payment info at upgrade time.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Passwordless Signup</h3>
        <p>
          Eliminate passwords entirely using magic links or one-time codes.
        </p>
        <ul className="space-y-2">
          <li><strong>Magic Link Flow:</strong> User enters email → send magic link → click link → account created. No password to remember or steal.</li>
          <li><strong>OTP Flow:</strong> User enters phone → send SMS code → enter code → account created. Leverages phone number as identity.</li>
          <li><strong>WebAuthn:</strong> Register biometric during signup. Future logins use Touch ID/Face ID. Most secure option.</li>
          <li><strong>Implementation:</strong> Keep traditional signup as fallback. Educate users on benefits. Monitor adoption rates.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO Signup</h3>
        <p>
          Support enterprise customers with domain-based SSO signup.
        </p>
        <ul className="space-y-2">
          <li><strong>Domain Detection:</strong> Detect enterprise email domain. Show "Sign in with Company" option.</li>
          <li><strong>SAML/OIDC:</strong> Redirect to company IdP for authentication. Handle SAML assertion or OIDC response.</li>
          <li><strong>Just-In-Time Provisioning:</strong> Create user account on first SSO login. Map IdP attributes to local schema.</li>
          <li><strong>SCIM Integration:</strong> Automated user provisioning from company directory. Sync group memberships.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Fraud Detection</h3>
        <p>
          Detect and prevent fraudulent signup attempts using behavioral and device signals.
        </p>
        <ul className="space-y-2">
          <li><strong>Device Fingerprinting:</strong> Collect browser signals (user agent, screen resolution, fonts, timezone, WebGL). Detect automation tools.</li>
          <li><strong>Behavioral Analysis:</strong> Monitor typing patterns, mouse movements, form completion time. Bots behave differently than humans.</li>
          <li><strong>Email Intelligence:</strong> Check for disposable email providers. Validate domain existence. Detect role-based emails (admin@, info@).</li>
          <li><strong>IP Intelligence:</strong> Use threat intelligence feeds. Block known bad IPs. Flag datacenter IPs for additional verification.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/signup-security.svg"
          alt="Signup Security Considerations"
          caption="Security — showing bot prevention, email enumeration protection, and rate limiting"
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize signup conversion while maintaining security?</p>
            <p className="mt-2 text-sm">
              A: Minimize required fields (email + password only), use invisible CAPTCHA (reCAPTCHA v3), implement progressive profiling for additional data, provide social signup options, show clear value proposition, and use real-time validation with helpful error messages. A/B test changes to measure impact. Balance friction for security (bot prevention) with friction for legitimate users (minimal).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent bot registrations at scale?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer approach: (1) Invisible CAPTCHA with risk scoring (reCAPTCHA v3, hCaptcha), (2) Honeypot fields for zero-friction detection, (3) Rate limiting by IP/device/email domain, (4) Device fingerprinting to detect automation, (5) Email verification before account activation, (6) Behavioral analysis (mouse movements, typing patterns, form completion time). Escalate challenges based on risk score - low risk passes through, high risk gets additional verification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you use single-page or multi-step signup?</p>
            <p className="mt-2 text-sm">
              A: Depends on field count and complexity. Single-page for {'<'}5 fields - lower abandonment, users see total commitment, faster completion. Multi-step for 6+ fields - reduces cognitive load, progress indicator motivates completion, can skip optional steps. Test both with A/B testing for your specific audience. Consider progressive profiling as alternative - collect minimal info at signup, gather more over time through engagement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email verification in signup flow?</p>
            <p className="mt-2 text-sm">
              A: Send verification email immediately after signup. Allow limited app access before verification (with restrictions like no payments, limited actions). Show persistent reminder to verify. Resend verification with rate limiting (max 3/hour). Expire unverified accounts after 7 days. Track verification rate as key metric. Use signed tokens with short expiry (24 hours). Consider phone verification as alternative or additional factor.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What password requirements do you enforce?</p>
            <p className="mt-2 text-sm">
              A: Follow NIST guidelines: minimum 8 characters (no maximum to prevent buffer issues), no composition rules (uppercase, symbols, numbers - they don't improve security), check against breached password lists (Have I Been Pwned API), show strength meter for user guidance, allow paste (password managers improve security), no security questions (easily researched). Consider passwordless options (magic link, WebAuthn) as primary authentication method.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design signup for international users?</p>
            <p className="mt-2 text-sm">
              A: Support international phone formats (libphonenumber library), accept Unicode in names (no ASCII-only restrictions), handle RTL languages (Arabic, Hebrew), provide language selector, respect local regulations (GDPR consent checkboxes, age verification for COPPA), offer local social providers (WeChat in China, LINE in Japan, Kakao in Korea), consider local date/name formats, support international email addresses (Unicode domains), test with real users from target markets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle social signup account linking?</p>
            <p className="mt-2 text-sm">
              A: When social email matches existing email account, prompt user to link accounts (verify password first for security). Allow multiple social providers per account (Google + Facebook + Apple). Show connected accounts in settings with option to disconnect. Handle edge cases: what if social email changes? What if user wants to unlink last provider? Require alternative auth method before allowing unlink. Track which provider was used for each login.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for signup optimization?</p>
            <p className="mt-2 text-sm">
              A: Primary: Signup conversion rate (visitors → completed signups), funnel drop-off per step (identify friction), time to complete. Secondary: Email verification rate, social signup % by provider, bot detection rate, validation error frequency (improve UX), mobile vs desktop conversion, A/B test results. Set up dashboards and alerts for significant changes. Use cohort analysis to track long-term retention by signup method.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Registration_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Registration Cheat Sheet</a></li>
          <li><a href="https://www.nngroup.com/articles/signup-forms/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Nielsen Norman Group - Signup Form Design</a></li>
          <li><a href="https://baymard.com/blog/ecommerce-checkout-usability" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Baymard Institute - Checkout Optimization</a></li>
          <li><a href="https://haveibeenpwned.com/API/v3" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Have I Been Pwned API</a></li>
          <li><a href="https://developers.google.com/recaptcha/v3" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google reCAPTCHA v3</a></li>
          <li><a href="https://www.fidoalliance.org/fido2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FIDO2/WebAuthn Specification</a></li>
          <li><a href="https://libphonenumber.appspot.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">libphonenumber - Phone Number Library</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Progressive_Profiling_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Progressive Profiling</a></li>
        </ul>
      </section>

      <section>
        <h2>Security Checklist</h2>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Pre-Launch Checklist</h3>
          <ul className="space-y-2">
            <li>☐ HTTPS enforced with HSTS headers</li>
            <li>☐ Bot prevention implemented (CAPTCHA, honeypot, rate limiting)</li>
            <li>☐ Generic error messages (no email enumeration)</li>
            <li>☐ CSRF token validation on signup form</li>
            <li>☐ Password strength enforcement (NIST compliant)</li>
            <li>☐ Email verification flow implemented</li>
            <li>☐ Secure session creation after signup</li>
            <li>☐ Audit logging for all registration events</li>
            <li>☐ Privacy policy and terms acceptance tracked</li>
            <li>☐ Age verification for COPPA compliance (if applicable)</li>
            <li>☐ GDPR consent checkboxes (if applicable)</li>
            <li>☐ Social signup providers configured and tested</li>
            <li>☐ Account linking flow for existing users</li>
            <li>☐ Unverified account expiration configured</li>
            <li>☐ Security headers configured (CSP, X-Frame-Options, etc.)</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>Test form validation (email format, password length, field matching)</li>
          <li>Test error message display for various validation failures</li>
          <li>Test loading state during registration</li>
          <li>Test email verification flow</li>
          <li>Test social signup button rendering</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>Test complete signup flow with valid data</li>
          <li>Test signup failure with existing email</li>
          <li>Test rate limiting (multiple signup attempts)</li>
          <li>Test email verification end-to-end</li>
          <li>Test social signup integration (Google, Apple, Facebook)</li>
          <li>Test account linking for existing users</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Tests</h3>
        <ul className="space-y-2">
          <li>Test for email enumeration (same error for all cases)</li>
          <li>Test CSRF token validation</li>
          <li>Test bot prevention (CAPTCHA bypass attempts)</li>
          <li>Test rate limiting effectiveness</li>
          <li>Test password strength enforcement</li>
          <li>Penetration testing for signup bypass</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>Test keyboard navigation (Tab, Enter)</li>
          <li>Test screen reader announcements</li>
          <li>Test color contrast for error messages</li>
          <li>Test form labels and ARIA attributes</li>
          <li>Test browser zoom (200%, 300%)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
