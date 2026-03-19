"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-dependency-management-extensive",
  title: "Dependency Management",
  description: "Comprehensive guide to dependency management, covering dependency versioning, supply chain security, vulnerability management, and build reproducibility for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "dependency-management",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "dependencies", "security", "supply-chain", "versioning"],
  relatedTopics: ["versioning", "security-posture", "change-management"],
};

export default function DependencyManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Dependency Management</strong> encompasses the practices and tools for managing external
          libraries, packages, and services that your system depends on. Modern applications have hundreds
          or thousands of dependencies — a typical npm project has 1,000+ transitive dependencies. Managing
          these dependencies securely and reliably is critical for system stability and security.
        </p>
        <p>
          Dependency risks include: security vulnerabilities, breaking changes, abandoned packages, supply
          chain attacks, and license compliance issues. A robust dependency management strategy addresses
          all these risks while enabling rapid development.
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Pin Versions:</strong> Exact versions for reproducibility.</li>
          <li><strong>Regular Updates:</strong> Keep dependencies current, don&apos;t let them drift.</li>
          <li><strong>Vulnerability Scanning:</strong> Automated security checks.</li>
          <li><strong>Minimal Dependencies:</strong> Fewer dependencies = less risk.</li>
          <li><strong>Supply Chain Security:</strong> Verify integrity of dependencies.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: You Own Your Dependencies</h3>
          <p>
            When you depend on a package, you inherit its bugs, vulnerabilities, and maintenance burden.
            The log4j vulnerability affected millions of applications — most didn&apos;t directly use log4j,
            it was a transitive dependency. You&apos;re responsible for knowing what&apos;s in your
            dependencies.
          </p>
        </div>
      </section>

      <section>
        <h2>Version Pinning Strategies</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Version Ranges</h3>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`^1.2.3  # Compatible with 1.2.3 (>=1.2.3, <2.0.0)
~1.2.3  # Approximately 1.2.3 (>=1.2.3, <1.3.0)
1.2.3   # Exact version only
*       # Any version (never use in production)`}
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Lock Files</h3>
        <p>
          Ensure reproducible builds:
        </p>
        <ul>
          <li><strong>package-lock.json:</strong> npm</li>
          <li><strong>yarn.lock:</strong> Yarn</li>
          <li><strong>Pipfile.lock:</strong> Pipenv</li>
          <li><strong>poetry.lock:</strong> Poetry</li>
          <li><strong>Gemfile.lock:</strong> Bundler</li>
        </ul>
        <p><strong>Best practice:</strong> Commit lock files to version control.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Semantic Versioning</h3>
        <p>MAJOR.MINOR.PATCH:</p>
        <ul>
          <li><strong>MAJOR:</strong> Breaking changes</li>
          <li><strong>MINOR:</strong> New features (backward compatible)</li>
          <li><strong>PATCH:</strong> Bug fixes (backward compatible)</li>
        </ul>
      </section>

      <section>
        <h2>Supply Chain Security</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Threats</h3>
        <ul>
          <li><strong>Malicious Packages:</strong> Typosquatting, dependency confusion.</li>
          <li><strong>Compromised Maintainers:</strong> Account takeover, insider threats.</li>
          <li><strong>Build System Compromise:</strong> Injected malware during build.</li>
          <li><strong>Transitive Dependencies:</strong> Vulnerabilities in dependencies of dependencies.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Mitigations</h3>
        <ul>
          <li><strong>Package Signatures:</strong> Verify package integrity (sigstore, cosign).</li>
          <li><strong>Private Registries:</strong> Mirror packages internally (Verdaccio, Nexus).</li>
          <li><strong>Allowlists:</strong> Only approved packages can be used.</li>
          <li><strong>SBOM:</strong> Software Bill of Materials — inventory of all dependencies.</li>
          <li><strong>Vendor Critical Dependencies:</strong> Fork and maintain critical packages.</li>
        </ul>
      </section>

      <section>
        <h2>Vulnerability Management</h2>
        
        <h3 className="mt-8 mb-4 text-xl font-semibold">Scanning Tools</h3>
        <ul>
          <li><strong>npm audit:</strong> Built-in npm vulnerability scanning.</li>
          <li><strong>Snyk:</strong> Multi-language vulnerability scanning.</li>
          <li><strong>Dependabot:</strong> GitHub automated updates.</li>
          <li><strong>Renovate:</strong> Automated dependency updates.</li>
          <li><strong>OWASP Dependency-Check:</strong> Open-source scanning.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Vulnerability Response Process</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Identify:</strong> Automated scanning detects vulnerability.</li>
          <li><strong>Assess:</strong> Is your code actually affected? (reachable, exploitable)</li>
          <li><strong>Prioritize:</strong> CVSS score, exploit availability, your exposure.</li>
          <li><strong>Remediate:</strong> Update, patch, or mitigate.</li>
          <li><strong>Verify:</strong> Confirm fix, rescan.</li>
        </ol>
      </section>

      <section>
        <h2>Dependency Hygiene</h2>
        <ul>
          <li><strong>Audit Regularly:</strong> Review dependencies quarterly.</li>
          <li><strong>Remove Unused:</strong> Delete dependencies you don&apos;t use.</li>
          <li><strong>Check Health:</strong> Is the package maintained? Recent commits? Open issues?</li>
          <li><strong>License Compliance:</strong> Ensure licenses are compatible with your use.</li>
          <li><strong>Monitor Abandonware:</strong> Plan migration for abandoned packages.</li>
          <li><strong>Minimize Transitive:</strong> Choose packages with few dependencies.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage dependency updates?</p>
            <p className="mt-2 text-sm">
              A: Automated tools (Dependabot, Renovate) for minor/patch updates. Manual review for major
              updates. Regular cadence (weekly review of automated PRs). Pin exact versions in production,
              use lock files. Test thoroughly before merging.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What would you do about a critical vulnerability like log4j?</p>
            <p className="mt-2 text-sm">
              A: Immediately identify all affected systems (SBOM helps), assess exploitability, apply vendor
              patches or upgrade, implement mitigations if patch unavailable (WAF rules, disabling features),
              monitor for exploitation attempts, document response for future reference.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you evaluate a new dependency?</p>
            <p className="mt-2 text-sm">
              A: Is it necessary or can we build it? Package health (downloads, stars, recent commits,
              open issues). Security history (past vulnerabilities). License compatibility. Number of
              transitive dependencies. Quality of documentation. Community activity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a Software Bill of Materials (SBOM)?</p>
            <p className="mt-2 text-sm">
              A: Complete inventory of all software components in your application — direct and transitive
              dependencies, versions, licenses. Critical for vulnerability response (know what you have),
              compliance, and supply chain security. Formats: SPDX, CycloneDX.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
