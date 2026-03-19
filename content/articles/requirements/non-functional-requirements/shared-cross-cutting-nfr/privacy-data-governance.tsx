"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-privacy-data-governance-extensive",
  title: "Privacy & Data Governance",
  description: "Comprehensive guide to privacy requirements, data governance frameworks, GDPR/CCPA compliance, data classification, and privacy-by-design for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "privacy-data-governance",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "privacy", "governance", "gdpr", "ccpa", "compliance", "data-protection"],
  relatedTopics: ["compliance-auditing", "data-lineage", "security-posture"],
};

export default function PrivacyDataGovernanceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Privacy & Data Governance</strong> encompasses the policies, processes, and technical
          controls for managing data throughout its lifecycle while respecting user privacy rights and
          regulatory requirements. It addresses what data is collected, how it&apos;s used, who can access
          it, and how long it&apos;s retained.
        </p>
        <p>
          Privacy regulations (GDPR, CCPA, HIPAA) have transformed data handling from a best practice to a
          legal requirement. Non-compliance carries significant penalties (GDPR: up to 4% of global revenue
          or €20M).
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Data Minimization:</strong> Collect only what&apos;s necessary.</li>
          <li><strong>Purpose Limitation:</strong> Use data only for stated purposes.</li>
          <li><strong>Consent:</strong> Obtain explicit consent for data collection.</li>
          <li><strong>Transparency:</strong> Clear privacy policies, accessible to users.</li>
          <li><strong>User Rights:</strong> Enable access, correction, deletion, portability.</li>
        </ul>
      </section>

      <section>
        <h2>Regulatory Frameworks</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">GDPR (EU)</h3>
        <ul>
          <li><strong>Scope:</strong> Any organization processing EU resident data.</li>
          <li><strong>Key Rights:</strong> Access, rectification, erasure, portability, objection.</li>
          <li><strong>Requirements:</strong> Consent, DPO, DPIA, breach notification (72 hours).</li>
          <li><strong>Penalties:</strong> Up to 4% global revenue or €20M.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">CCPA/CPRA (California)</h3>
        <ul>
          <li><strong>Scope:</strong> Businesses handling California resident data.</li>
          <li><strong>Key Rights:</strong> Know, delete, opt-out of sale, correct.</li>
          <li><strong>Requirements:</strong> Privacy policy, opt-out mechanism, non-discrimination.</li>
          <li><strong>Penalties:</strong> $2,500-$7,500 per violation.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HIPAA (Healthcare)</h3>
        <ul>
          <li><strong>Scope:</strong> Healthcare providers, insurers, business associates.</li>
          <li><strong>Requirements:</strong> PHI protection, access controls, audit logs.</li>
          <li><strong>Penalties:</strong> Up to $1.5M per violation category per year.</li>
        </ul>
      </section>

      <section>
        <h2>Data Classification</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Classification Levels</h3>
        <ul>
          <li><strong>Public:</strong> No restrictions (marketing content).</li>
          <li><strong>Internal:</strong> Employee access only (internal docs).</li>
          <li><strong>Confidential:</strong> Need-to-know (customer data).</li>
          <li><strong>Restricted:</strong> Highest protection (PII, PHI, financial).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">PII Categories</h3>
        <ul>
          <li><strong>Direct Identifiers:</strong> Name, email, SSN, passport.</li>
          <li><strong>Indirect Identifiers:</strong> IP address, device ID, location.</li>
          <li><strong>Sensitive PII:</strong> Health data, biometrics, financial accounts.</li>
        </ul>
      </section>

      <section>
        <h2>Privacy-by-Design</h2>
        <p>Integrate privacy into system design:</p>
        <ul>
          <li><strong>Data Inventory:</strong> Know what data you have and where.</li>
          <li><strong>Access Controls:</strong> Least privilege, role-based access.</li>
          <li><strong>Encryption:</strong> At rest and in transit.</li>
          <li><strong>Retention Policies:</strong> Automatic deletion after retention period.</li>
          <li><strong>Audit Logging:</strong> Track all data access.</li>
          <li><strong>Privacy Impact Assessment:</strong> Evaluate new features for privacy impact.</li>
        </ul>
      </section>

      <section>
        <h2>User Rights Implementation</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Right to Access</h3>
        <p>Provide users copy of their data within 30 days (GDPR).</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Right to Erasure</h3>
        <p>Delete user data upon request (with legal exceptions).</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Right to Portability</h3>
        <p>Export data in machine-readable format.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Right to Opt-Out</h3>
        <p>Allow users to opt-out of data sale/sharing.</p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are key GDPR requirements for engineering?</p>
            <p className="mt-2 text-sm">
              A: Data minimization, purpose limitation, consent management, user rights (access, erasure,
              portability), breach notification, privacy-by-design, data protection impact assessments,
              audit logging.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement right to erasure?</p>
            <p className="mt-2 text-sm">
              A: Maintain data inventory mapping all locations of user data. Implement soft delete with
              retention period. Provide automated deletion workflow. Handle legal holds and backup deletion.
              Document exceptions (legal requirements, fraud prevention).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is privacy-by-design?</p>
            <p className="mt-2 text-sm">
              A: Integrating privacy into system design from the start, not as an afterthought. Includes:
              data minimization, access controls, encryption, retention policies, audit logging, and
              privacy impact assessments for new features.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cross-border data transfers?</p>
            <p className="mt-2 text-sm">
              A: Use Standard Contractual Clauses (SCCs), Binding Corporate Rules (BCRs), or ensure
              adequacy decisions. For US-EU, use Data Privacy Framework. Document transfer mechanisms,
              implement additional safeguards (encryption, access controls).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
