"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-end-to-end-security-posture-extensive",
  title: "End-to-End Security Posture",
  description: "Comprehensive guide to end-to-end security posture, covering defense in depth, threat modeling, security controls across layers, and security governance for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "end-to-end-security-posture",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "security", "threat-modeling", "compliance", "governance"],
  relatedTopics: ["authentication-infrastructure", "authorization-model", "secrets-management"],
};

export default function EndToEndSecurityPostureArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>End-to-End Security Posture</strong> encompasses the comprehensive security controls,
          processes, and practices that protect a system across all layers—from user interface to
          database, from development to production. It&apos;s not a single technology but a holistic
          approach that considers threats at every layer and implements defense in depth.
        </p>
        <p>
          Security posture answers critical questions: What are our assets and what threats do they face?
          What controls protect each layer? How do we detect and respond to breaches? How do we prove
          compliance? A strong security posture means attackers must overcome multiple independent
          controls to compromise the system. For staff and principal engineers, security is an
          architectural concern—the decisions you make about authentication, authorization, encryption,
          and monitoring determine the organization&apos;s risk exposure.
        </p>
        <p>
          <strong>Key principles of end-to-end security:</strong>
        </p>
        <ul>
          <li>
            <strong>Defense in Depth:</strong> Multiple independent security layers—if one fails,
            others provide protection.
          </li>
          <li>
            <strong>Least Privilege:</strong> Every component, user, and process has minimum necessary
            permissions.
          </li>
          <li>
            <strong>Zero Trust:</strong> Never trust, always verify—authenticate and authorize every
            request.
          </li>
          <li>
            <strong>Secure by Default:</strong> Security is the default state, not an option users enable.
          </li>
          <li>
            <strong>Security as Code:</strong> Security controls are versioned, tested, and automated.
          </li>
          <li>
            <strong>Security by Design:</strong> Security considered from the start, not bolted on later.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/security-architecture-principles.svg"
          alt="Security Architecture Principles showing defense in depth"
          caption="Security Architecture Principles: Defense in depth with multiple independent layers—network, application, data, and infrastructure controls working together."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Security Is a Chain</h3>
          <p>
            Security is only as strong as the weakest link. A sophisticated authentication system is
            useless if the database is exposed. Perfect encryption is pointless if API keys are in
            source code. End-to-end security requires every layer to be secure.
          </p>
          <p className="mt-3">
            <strong>Attack surface:</strong> Every exposed endpoint, every dependency, every configuration
            is a potential entry point. Minimize surface area, maximize visibility.
          </p>
        </div>
      </section>

      <section>
        <h2>Threat Modeling</h2>
        <p>
          Understanding threats is the foundation of security. Threat modeling is a systematic process
          for identifying, quantifying, and addressing security risks.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">STRIDE Framework</h3>
        <p>
          Microsoft&apos;s STRIDE categorizes threats into six types:
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Threat</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Example</th>
                <th className="p-3 text-left">Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Spoofing</td>
                <td className="p-3">Impersonating legitimate users/systems</td>
                <td className="p-3">Fake login page, stolen credentials</td>
                <td className="p-3">Authentication, MFA, certificates</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Tampering</td>
                <td className="p-3">Modifying data or code</td>
                <td className="p-3">SQL injection, modifying requests</td>
                <td className="p-3">Integrity checks, signatures, hashes</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Repudiation</td>
                <td className="p-3">Denying actions occurred</td>
                <td className="p-3">&quot;I didn&apos;t make that transaction&quot;</td>
                <td className="p-3">Audit logs, non-repudiation, signatures</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Information Disclosure</td>
                <td className="p-3">Exposing sensitive data</td>
                <td className="p-3">Data breach, insecure API</td>
                <td className="p-3">Encryption, access controls, masking</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Denial of Service</td>
                <td className="p-3">Making system unavailable</td>
                <td className="p-3">DDoS attack, resource exhaustion</td>
                <td className="p-3">Rate limiting, redundancy, scaling</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Elevation of Privilege</td>
                <td className="p-3">Gaining unauthorized access</td>
                <td className="p-3">Admin access via bug, privilege escalation</td>
                <td className="p-3">Authorization, least privilege, validation</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Threat Modeling Process</h3>
        <p>
          Systematic approach to identifying and addressing threats:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Step 1: Diagram the System</h4>
        <ul>
          <li>Create data flow diagram (DFD)</li>
          <li>Identify all components (processes, data stores, external entities)</li>
          <li>Map data flows between components</li>
          <li>Mark trust boundaries (where trust level changes)</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Step 2: Identify Assets</h4>
        <ul>
          <li>What needs protection? (data, systems, reputation)</li>
          <li>Classify assets by sensitivity</li>
          <li>Identify regulatory requirements</li>
          <li>Understand business impact of compromise</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Step 3: Identify Threats</h4>
        <ul>
          <li>Apply STRIDE to each component and data flow</li>
          <li>Consider each trust boundary</li>
          <li>Think like an attacker</li>
          <li>Document all identified threats</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Step 4: Rate Threats</h4>
        <ul>
          <li>Use DREAD (Damage, Reproducibility, Exploitability, Affected users, Discoverability)</li>
          <li>Or risk matrix (likelihood × impact)</li>
          <li>Prioritize high-risk threats</li>
          <li>Document risk ratings</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Step 5: Define Mitigations</h4>
        <ul>
          <li>Security controls for each high-risk threat</li>
          <li>Consider cost vs. benefit</li>
          <li>Assign ownership for implementation</li>
          <li>Set timelines for remediation</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Step 6: Validate</h4>
        <ul>
          <li>Test that mitigations are effective</li>
          <li>Security testing (SAST, DAST, penetration testing)</li>
          <li>Update threat model as system evolves</li>
          <li>Repeat threat modeling for major changes</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/security-threat-model.svg"
          alt="Threat Modeling Process with STRIDE"
          caption="Threat Modeling Process: From system diagram through STRIDE analysis, risk rating, mitigations, and validation—iterative security improvement."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Threat Model Early and Often</h3>
          <p>
            Threat modeling is most effective when done during design, before code is written. But
            it&apos;s never too late—threat model existing systems too. Update threat models as systems
            evolve. Make threat modeling part of your development process.
          </p>
        </div>
      </section>

      <section>
        <h2>Security Controls by Layer</h2>
        <p>
          Defense in depth requires controls at every layer. Each layer provides independent protection
          so if one control fails, others still protect the system.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Network Layer</h3>
        <p>
          First line of defense—protect the network perimeter and internal network segments.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Firewalls</h4>
        <ul>
          <li>Restrict inbound traffic to necessary ports only</li>
          <li>Restrict outbound traffic (prevent data exfiltration)</li>
          <li>Web Application Firewall (WAF) for HTTP traffic</li>
          <li>Next-gen firewalls with application awareness</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">DDoS Protection</h4>
        <ul>
          <li>Rate limiting at edge</li>
          <li>Traffic scrubbing services (Cloudflare, AWS Shield)</li>
          <li>CDN for static content distribution</li>
          <li>Auto-scaling to absorb attack traffic</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Network Segmentation</h4>
        <ul>
          <li>Isolate sensitive systems (database tier)</li>
          <li>Separate production from development</li>
          <li>Micro-segmentation for zero trust</li>
          <li>VLANs, VPCs, security groups</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Encryption in Transit</h4>
        <ul>
          <li>TLS 1.3 for all traffic</li>
          <li>Certificate management and rotation</li>
          <li>mTLS for service-to-service authentication</li>
          <li>HSTS for web applications</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Private Networks</h4>
        <ul>
          <li>VPC for cloud resources</li>
          <li>Private subnets for internal services</li>
          <li>NAT gateway for outbound traffic</li>
          <li>VPC peering for cross-service communication</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Application Layer</h3>
        <p>
          Protect the application itself from attacks targeting code and logic.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Input Validation</h4>
        <ul>
          <li>Validate all user input (type, length, format, range)</li>
          <li>Whitelist allowed values where possible</li>
          <li>Prevent injection attacks (SQL, XSS, command)</li>
          <li>Use parameterized queries for database access</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Authentication</h4>
        <ul>
          <li>Strong authentication (OAuth2, OIDC, SAML)</li>
          <li>Multi-factor authentication (MFA)</li>
          <li>Password policies (length, complexity, rotation)</li>
          <li>Session management (secure cookies, timeout, rotation)</li>
          <li>Account lockout after failed attempts</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Authorization</h4>
        <ul>
          <li>Role-Based Access Control (RBAC)</li>
          <li>Attribute-Based Access Control (ABAC)</li>
          <li>Principle of least privilege</li>
          <li>Regular access reviews</li>
          <li>Separation of duties</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Session Management</h4>
        <ul>
          <li>Secure cookie flags (HttpOnly, Secure, SameSite)</li>
          <li>Session timeout (absolute and idle)</li>
          <li>Session rotation after authentication</li>
          <li>Invalidate sessions on logout and password change</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Attack Prevention</h4>
        <ul>
          <li>CORS (Cross-Origin Resource Sharing) configuration</li>
          <li>CSRF (Cross-Site Request Forgery) tokens</li>
          <li>Content Security Policy (CSP)</li>
          <li>Rate limiting per user/IP</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Data Layer</h3>
        <p>
          Protect data at rest and control access to sensitive information.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Encryption at Rest</h4>
        <ul>
          <li>Database encryption (TDE, column-level)</li>
          <li>File encryption for sensitive files</li>
          <li>Key management (KMS, HSM)</li>
          <li>Key rotation policies</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Access Controls</h4>
        <ul>
          <li>Database users with minimal privileges</li>
          <li>Application-specific database accounts</li>
          <li>No direct database access from applications</li>
          <li>Regular access audits</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Data Masking</h4>
        <ul>
          <li>Mask sensitive data in non-production</li>
          <li>Dynamic data masking for queries</li>
          <li>Tokenization for payment data</li>
          <li>Differential privacy for analytics</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Audit Logging</h4>
        <ul>
          <li>Log all data access and modifications</li>
          <li>Include who, what, when, where</li>
          <li>Immutable log storage</li>
          <li>Regular log review and analysis</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Backup Security</h4>
        <ul>
          <li>Encrypted backups</li>
          <li>Access controls on backup storage</li>
          <li>Regular backup testing</li>
          <li>Off-site backup copies</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Infrastructure Layer</h3>
        <p>
          Secure the underlying infrastructure that runs applications.
        </p>
        <h4 className="mt-4 mb-2 font-semibold">System Hardening</h4>
        <ul>
          <li>Minimal OS installation</li>
          <li>Disable unnecessary services</li>
          <li>Remove unused software</li>
          <li>Security baselines (CIS benchmarks)</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Patch Management</h4>
        <ul>
          <li>Regular security updates</li>
          <li>Automated patching where possible</li>
          <li>Test patches before production</li>
          <li>Track patch compliance</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Secrets Management</h4>
        <ul>
          <li>Never store secrets in code</li>
          <li>Use secrets management (Vault, Secrets Manager)</li>
          <li>Secret rotation</li>
          <li>Audit secret access</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Container Security</h4>
        <ul>
          <li>Image scanning for vulnerabilities</li>
          <li>Minimal base images</li>
          <li>Run as non-root</li>
          <li>Container runtime security</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">IAM (Identity and Access Management)</h4>
        <ul>
          <li>Fine-grained permissions</li>
          <li>Regular access reviews</li>
          <li>MFA for all users</li>
          <li>Service accounts with minimal permissions</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/security-controls-layers.svg"
          alt="Security Controls by Layer showing defense in depth"
          caption="Security Controls by Layer: Network, Application, Data, and Infrastructure controls working together for comprehensive protection."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Layers Must Be Independent</h3>
          <p>
            For defense in depth to work, layers must be independent. If the same vulnerability can
            bypass multiple layers, you don&apos;t have defense in depth. Example: Network firewall +
            application authentication + database authorization are independent. But two firewalls from
            same vendor with same rule engine are not.
          </p>
        </div>
      </section>

      <section>
        <h2>Detection and Response</h2>
        <p>
          Prevention is not enough—assume breaches will happen and prepare to detect and respond quickly.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Monitoring</h3>
        <h4 className="mt-4 mb-2 font-semibold">SIEM (Security Information and Event Management)</h4>
        <ul>
          <li>Centralized log collection and analysis</li>
          <li>Correlation across multiple data sources</li>
          <li>Alert on suspicious patterns</li>
          <li>Examples: Splunk, ELK Stack, Datadog Security, Azure Sentinel</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">IDS/IPS (Intrusion Detection/Prevention)</h4>
        <ul>
          <li>Network-based IDS/IPS (NIDS/NIPS)</li>
          <li>Host-based IDS/IPS (HIDS/HIPS)</li>
          <li>Signature-based and anomaly-based detection</li>
          <li>Examples: Snort, Suricata, OSSEC</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Anomaly Detection</h4>
        <ul>
          <li>ML-based detection of unusual patterns</li>
          <li>User behavior analytics (UBA)</li>
          <li>Baseline normal behavior, alert on deviations</li>
          <li>Examples: Darktrace, AWS GuardDuty</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">File Integrity Monitoring</h4>
        <ul>
          <li>Detect unauthorized file changes</li>
          <li>Monitor critical system files</li>
          <li>Alert on unexpected modifications</li>
          <li>Examples: Tripwire, OSSEC</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Incident Response</h3>
        <p>
          Structured approach to security incidents:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Phase 1: Preparation</h4>
        <ul>
          <li>Incident response plan documented</li>
          <li>Trained response team</li>
          <li>Tools and access ready</li>
          <li>Communication templates prepared</li>
          <li>Regular tabletop exercises</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Phase 2: Identification</h4>
        <ul>
          <li>Detect potential incident</li>
          <li>Validate it&apos;s a real incident</li>
          <li>Classify severity</li>
          <li>Activate response team</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Phase 3: Containment</h4>
        <ul>
          <li>Short-term containment (stop the bleeding)</li>
          <li>Isolate affected systems</li>
          <li>Revoke compromised credentials</li>
          <li>Block malicious IPs</li>
          <li>Long-term containment (prepare for eradication)</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Phase 4: Eradication</h4>
        <ul>
          <li>Remove threat (malware, backdoors)</li>
          <li>Patch vulnerabilities</li>
          <li>Reset compromised credentials</li>
          <li>Verify threat is fully removed</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Phase 5: Recovery</h4>
        <ul>
          <li>Restore systems from clean backups</li>
          <li>Verify security before returning to production</li>
          <li>Monitor for signs of re-infection</li>
          <li>Gradual return to normal operations</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Phase 6: Lessons Learned</h4>
        <ul>
          <li>Post-mortem within 1-2 weeks</li>
          <li>Document what happened, why, how responded</li>
          <li>Identify improvements</li>
          <li>Update incident response plan</li>
          <li>Implement preventive measures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Testing</h3>
        <h4 className="mt-4 mb-2 font-semibold">SAST (Static Application Security Testing)</h4>
        <ul>
          <li>Analyze source code for vulnerabilities</li>
          <li>Run in CI/CD pipeline</li>
          <li>Find issues before deployment</li>
          <li>Examples: SonarQube, Checkmarx, Semgrep</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">DAST (Dynamic Application Security Testing)</h4>
        <ul>
          <li>Test running application</li>
          <li>Simulate attacks</li>
          <li>Find runtime vulnerabilities</li>
          <li>Examples: OWASP ZAP, Burp Suite</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Penetration Testing</h4>
        <ul>
          <li>Simulated attacks by security experts</li>
          <li>Internal and external testing</li>
          <li>Annual minimum, more for critical systems</li>
          <li>Remediate findings promptly</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Red Team Exercises</h4>
        <ul>
          <li>Full-scope adversarial simulation</li>
          <li>Test detection and response</li>
          <li>Multi-week engagements</li>
          <li>Focus on learning, not &quot;winning&quot;</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Bug Bounty Programs</h4>
        <ul>
          <li>Crowdsourced vulnerability discovery</li>
          <li>Pay researchers for valid findings</li>
          <li>Continuous testing</li>
          <li>Examples: HackerOne, Bugcrowd</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Assume Breach</h3>
          <p>
            Modern security assumes attackers will get in. Focus on detection and response, not just
            prevention. How quickly can you detect a breach? How quickly can you respond? Mean Time To
            Detect (MTTD) and Mean Time To Respond (MTTR) are critical security metrics.
          </p>
        </div>
      </section>

      <section>
        <h2>Compliance and Governance</h2>
        <p>
          Regulatory compliance drives security requirements. Governance ensures security is maintained
          over time.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Common Frameworks</h3>
        <h4 className="mt-4 mb-2 font-semibold">SOC 2</h4>
        <ul>
          <li>Service Organization Control 2</li>
          <li>Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy</li>
          <li>Type I (point in time) vs Type II (period of time)</li>
          <li>Required for B2B SaaS companies</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">ISO 27001</h4>
        <ul>
          <li>Information Security Management System (ISMS)</li>
          <li>Risk-based approach</li>
          <li>Continuous improvement</li>
          <li>Internationally recognized</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">GDPR</h4>
        <ul>
          <li>EU data protection regulation</li>
          <li>Applies to any company processing EU resident data</li>
          <li>Consent, data subject rights, breach notification</li>
          <li>Fines up to 4% of global revenue</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">HIPAA</h4>
        <ul>
          <li>US healthcare data protection</li>
          <li>Protected Health Information (PHI)</li>
          <li>Administrative, physical, technical safeguards</li>
          <li>Applies to covered entities and business associates</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">PCI DSS</h4>
        <ul>
          <li>Payment Card Industry Data Security Standard</li>
          <li>Required for companies handling credit cards</li>
          <li>12 requirements across 6 goals</li>
          <li>Annual assessment required</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Governance</h3>
        <h4 className="mt-4 mb-2 font-semibold">Security Policies</h4>
        <ul>
          <li>Documented security requirements</li>
          <li>Acceptable use policy</li>
          <li>Data classification policy</li>
          <li>Access control policy</li>
          <li>Incident response policy</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Risk Assessments</h4>
        <ul>
          <li>Regular security risk evaluation</li>
          <li>Identify assets, threats, vulnerabilities</li>
          <li>Quantify risk (likelihood × impact)</li>
          <li>Prioritize remediation</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Security Training</h4>
        <ul>
          <li>Employee security awareness</li>
          <li>Phishing simulations</li>
          <li>Role-specific training (developers, ops)</li>
          <li>Annual minimum, regular refreshers</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Access Reviews</h4>
        <ul>
          <li>Periodic permission audits</li>
          <li>Verify access is still needed</li>
          <li>Remove unnecessary access</li>
          <li>Document exceptions</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Vendor Risk Management</h4>
        <ul>
          <li>Third-party security assessments</li>
          <li>Security questionnaires</li>
          <li>Contract security requirements</li>
          <li>Regular vendor audits</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/security-program-maturity.svg"
          alt="Security Program Maturity Model"
          caption="Security Program Maturity: From ad-hoc security through defined, managed, to optimized—continuous improvement journey."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Compliance ≠ Security</h3>
          <p>
            Compliance is necessary but not sufficient for security. You can be compliant and still be
            vulnerable. Use compliance as a baseline, but build security beyond what&apos;s required.
            Compliance is about proving security; security is about actually being secure.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <h3 className="mt-8 mb-4 text-xl font-semibold">Secure Development</h3>
        <ul>
          <li>Security training for all developers</li>
          <li>Secure coding standards</li>
          <li>Code review with security focus</li>
          <li>SAST/DAST in CI/CD pipeline</li>
          <li>Dependency scanning</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Operations</h3>
        <ul>
          <li>24/7 security monitoring</li>
          <li>Documented incident response procedures</li>
          <li>Regular security testing</li>
          <li>Vulnerability management program</li>
          <li>Regular access reviews</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Culture</h3>
        <ul>
          <li>Security champions in each team</li>
          <li>Regular security communications</li>
          <li>Reward security reporting</li>
          <li>Blameless post-mortems</li>
          <li>Security as everyone&apos;s responsibility</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Continuous Improvement</h3>
        <ul>
          <li>Regular security assessments</li>
          <li>Learn from incidents</li>
          <li>Stay current on threats</li>
          <li>Update security controls</li>
          <li>Measure security metrics</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>
            <strong>Security as afterthought:</strong> Bolted on at end. Fix: Security by design,
            threat modeling early.
          </li>
          <li>
            <strong>Single layer of defense:</strong> One control fails, game over. Fix: Defense in
            depth, independent layers.
          </li>
          <li>
            <strong>No incident response plan:</strong> Panic when breach occurs. Fix: Documented plan,
            regular exercises.
          </li>
          <li>
            <strong>Compliance checkbox:</strong> Compliant but not secure. Fix: Security beyond
            compliance requirements.
          </li>
          <li>
            <strong>Secrets in code:</strong> Credentials in repositories. Fix: Secrets management,
            scanning tools.
          </li>
          <li>
            <strong>No logging:</strong> Can&apos;t detect or investigate breaches. Fix: Comprehensive
            logging, centralized SIEM.
          </li>
          <li>
            <strong>Over-privileged access:</strong> Everyone has admin access. Fix: Least privilege,
            regular access reviews.
          </li>
          <li>
            <strong>Unpatched systems:</strong> Known vulnerabilities exploited. Fix: Automated patching,
            vulnerability management.
          </li>
          <li>
            <strong>No security testing:</strong> Vulnerabilities undiscovered. Fix: Regular penetration
            testing, bug bounty.
          </li>
          <li>
            <strong>Security vs engineering:</strong> Adversarial relationship. Fix: Security champions,
            enablement not gatekeeping.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is defense in depth?</p>
            <p className="mt-2 text-sm">
              A: Multiple independent security layers so if one control fails, others provide protection.
              Example: Firewall + authentication + authorization + encryption + audit logging. Attacker
              must bypass all layers to compromise data. Layers must be independent—same vulnerability
              shouldn&apos;t bypass multiple layers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you approach threat modeling?</p>
            <p className="mt-2 text-sm">
              A: (1) Diagram system with data flows and trust boundaries, (2) Identify assets to protect,
              (3) Apply STRIDE framework to find threats, (4) Rate threats by risk (likelihood × impact),
              (5) Define mitigations for high-risk threats, (6) Validate mitigations are effective. Do
              this during design, update as system evolves.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What security controls would you implement for a web application?</p>
            <p className="mt-2 text-sm">
              A: Network: TLS, WAF, DDoS protection, network segmentation. Application: Input validation,
              authentication (MFA), authorization (RBAC), session management, CSRF protection. Data:
              Encryption at rest and transit, access controls, audit logging. Infrastructure: Patch
              management, secrets management, container security, IAM.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle a security breach?</p>
            <p className="mt-2 text-sm">
              A: Follow incident response process: (1) Identify and validate breach, (2) Contain (isolate
              systems, revoke access), (3) Eradicate (patch, remove threat), (4) Recover (restore systems,
              verify security), (5) Lessons learned (post-mortem, improve defenses). Communication with
              stakeholders throughout. Document everything.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is zero trust architecture?</p>
            <p className="mt-2 text-sm">
              A: Never trust, always verify. Every request is authenticated and authorized regardless of
              source. Micro-segmentation, least privilege access, continuous verification. Assumes network
              is hostile—no implicit trust based on network location. mTLS for service-to-service, strict
              IAM policies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure security in CI/CD?</p>
            <p className="mt-2 text-sm">
              A: SAST/DAST in pipeline, dependency scanning (Snyk, Dependabot), container image scanning,
              secrets scanning (prevent credential commits), infrastructure as code scanning, security
              gates before deployment, automated compliance checks. Security is part of definition of done.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>OWASP Top 10: <a href="https://owasp.org/www-project-top-ten/" className="text-accent hover:underline">owasp.org</a></li>
          <li>Microsoft Threat Modeling Tool</li>
          <li>NIST Cybersecurity Framework</li>
          <li>CIS Controls: <a href="https://cisecurity.org" className="text-accent hover:underline">cisecurity.org</a></li>
          <li>&quot;Threat Modeling&quot; by Adam Shostack</li>
          <li>&quot;Security Engineering&quot; by Ross Anderson</li>
          <li>Google SRE Book: Security</li>
          <li>AWS Security Best Practices</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}