"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-environment-variables",
  title: "Environment Variables",
  description:
    "Comprehensive guide to frontend environment variables covering build-time injection, runtime configuration, security considerations, validation patterns, and multi-environment management.",
  category: "frontend",
  subcategory: "build-deployment",
  slug: "environment-variables",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "frontend",
    "environment variables",
    "configuration",
    "security",
    "build-time",
    "runtime",
  ],
  relatedTopics: [
    "webpack-vite-rollup-configuration",
    "ci-cd-pipelines",
    "feature-flags-for-gradual-rollout",
  ],
};

export default function EnvironmentVariablesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Environment variables</strong> in frontend development are key-value pairs that configure application behavior across different deployment environments (development, staging, production). Unlike backend environment variables that are read at runtime from the server process, frontend environment variables are injected at build time — the build tool replaces variable references in source code with actual values before generating the production bundle. This fundamental difference has critical implications for security (variables are visible in the bundle source), deployment (changing variables requires a rebuild), and configuration management (variables must be available during the build process).
        </p>
        <p>
          For staff-level engineers, understanding the distinction between build-time and runtime configuration is essential. Build-time environment variables are baked into the bundle during the build process, meaning that changing a variable requires rebuilding the entire application. Runtime configuration (fetching configuration from a JSON endpoint, using a configuration service) allows configuration changes without rebuilding, which is critical for applications that need to adapt configuration between environments without triggering a new build pipeline. The choice between build-time and runtime configuration depends on how frequently configuration changes, whether zero-downtime reconfiguration is needed, and security requirements.
        </p>
        <p>
          Frontend environment variables serve several purposes: API endpoint configuration (different URLs for development, staging, production), feature flags (enabling or disabling features per environment), analytics configuration (different tracking IDs per environment), third-party service keys (public API keys for services like maps, payment processors), and build mode indicators (development versus production behavior). The key security principle is that all frontend environment variables are public — they are embedded in the JavaScript bundle and visible to anyone who inspects the source. Therefore, never include secrets (private API keys, database credentials, passwords) in frontend environment variables.
        </p>
        <p>
          Each build tool has its own convention for environment variables. Webpack uses the DefinePlugin to replace process.env.VAR_NAME references with actual values. Vite uses import.meta.env.VAR_NAME and only exposes variables prefixed with VITE_ (a security measure to prevent accidentally exposing sensitive variables). Rollup uses rollup-plugin-replace for similar substitution. Understanding these conventions is essential for configuring environment variables correctly and avoiding common pitfalls like accidentally exposing secrets or using the wrong variable prefix.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Build-Time Injection:</strong> Environment variables are replaced in source code during the build process, not at runtime. The build tool scans source files for variable references, replaces them with actual values from the environment, and generates a bundle with hardcoded values. This means the variable values are fixed at build time — changing an environment variable requires rebuilding the entire application. This is fundamentally different from backend environment variables, which are read at runtime from the server process.
          </li>
          <li>
            <strong>Public Visibility:</strong> All frontend environment variables are public — they are embedded in the JavaScript bundle and visible to anyone who inspects the source code. This is a critical security consideration: never include secrets (private API keys, database credentials, OAuth client secrets) in frontend environment variables. Only include public configuration (public API endpoints, public analytics IDs, public feature flags). Any value that should remain secret must be kept on the backend and accessed via API calls.
          </li>
          <li>
            <strong>Variable Prefixing:</strong> Build tools use prefix conventions to control which variables are exposed to the frontend. Vite only exposes variables prefixed with VITE_ (import.meta.env.VITE_API_URL), preventing accidental exposure of sensitive variables. Webpack exposes all variables explicitly configured in DefinePlugin. Understanding and following these conventions is essential for security — using the correct prefix ensures that sensitive variables are not accidentally included in the bundle.
          </li>
          <li>
            <strong>Multi-Environment Configuration:</strong> Applications typically have multiple environments (development, staging, production, preview) with different variable values. Environment files (.env.development, .env.staging, .env.production) store variable values per environment. The build tool automatically loads the appropriate file based on the build mode. This pattern ensures that each environment has its own configuration without hardcoding values in source code.
          </li>
          <li>
            <strong>Runtime Configuration:</strong> An alternative to build-time injection where configuration is fetched at runtime from a JSON file or configuration service. This allows changing configuration without rebuilding (e.g., updating an API endpoint in staging without triggering a new build). Runtime configuration is essential for applications that need to adapt configuration between deployments without going through the build pipeline, but it adds complexity (fetching configuration before the app starts, handling configuration fetch failures).
          </li>
          <li>
            <strong>Variable Validation:</strong> Validating that required environment variables are present and correctly formatted before the build starts. This prevents builds from succeeding with missing or invalid configuration, which would produce broken deployments. Validation can include type checking (ensuring a variable is a number), format checking (ensuring a URL is valid), and presence checking (ensuring required variables are not empty).
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/env-var-lifecycle.svg"
          alt="Environment Variable Lifecycle showing definition, build-time injection, bundle generation, and runtime access"
          caption="Environment variable lifecycle — defined in .env files, injected during build, embedded in bundle, accessible at runtime as hardcoded values"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Environment variable architecture consists of definition (storing variables in .env files or CI/CD secrets), build-time injection (replacing variable references with actual values), and runtime access (reading hardcoded values from the bundle). The flow begins with developers defining variables in .env files (local development) or CI/CD secrets (production builds). During the build, the build tool loads the appropriate .env file based on the build mode, replaces all variable references in source code with actual values, and generates a bundle with hardcoded configuration.
        </p>
        <p>
          The key insight is that after the build, environment variables no longer exist as variables — they are hardcoded values in the bundle. This means that changing an environment variable requires rebuilding the application, redeploying the bundle, and waiting for users to download the new bundle. For applications that need frequent configuration changes, runtime configuration (fetching configuration from a JSON endpoint) is more appropriate than build-time injection.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/build-time-vs-runtime.svg"
          alt="Build-time vs Runtime Configuration comparison showing when variables are resolved and their trade-offs"
          caption="Build-time vs runtime configuration — build-time injects during build (fast at runtime, requires rebuild), runtime fetches at startup (flexible, adds complexity)"
          width={900}
          height={500}
        />

        <h3>Build Tool Conventions</h3>
        <p>
          <strong>Webpack:</strong> Uses DefinePlugin to replace process.env.VAR_NAME with actual values. All variables must be explicitly defined in the plugin configuration — undefined variables are not automatically replaced. This gives precise control over which variables are exposed but requires more configuration. Best for: applications with strict security requirements where every exposed variable must be explicitly approved.
        </p>
        <p>
          <strong>Vite:</strong> Uses import.meta.env.VAR_NAME and automatically loads .env files. Only variables prefixed with VITE_ are exposed to the client (security measure). Other variables (without prefix) are available only in Node.js build scripts, not in client code. This convention prevents accidental exposure of sensitive variables. Best for: applications wanting security-by-default with minimal configuration.
        </p>
        <p>
          <strong>Rollup:</strong> Uses rollup-plugin-replace to replace string patterns with actual values. This is a simple string replacement approach — any occurrence of the specified pattern is replaced. Less sophisticated than Webpack or Vite, but works well for library builds where configuration is minimal. Best for: JavaScript libraries and packages where environment variable needs are simple.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/env-security-model.svg"
          alt="Environment Variable Security Model showing public vs secret variable classification and handling"
          caption="Security model — public variables (API URLs, analytics IDs) safe for frontend, secret variables (API keys, passwords) must stay on backend"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Environment variable configuration involves trade-offs between build-time injection and runtime configuration, security and convenience, and simplicity and flexibility. Understanding these trade-offs is essential for choosing the right approach for each use case.
        </p>

        <h3>Build-Time vs. Runtime Configuration</h3>
        <p>
          <strong>Build-Time Injection:</strong> Variables are baked into the bundle during the build. Advantages: zero runtime overhead (values are hardcoded, no fetch needed), simple implementation (no configuration fetch logic), fast application startup (no configuration fetch delay). Limitations: changing variables requires a full rebuild and redeploy, cannot adapt configuration between deployments without rebuilding, configuration changes are coupled to code changes. Best for: configuration that rarely changes (API endpoints, analytics IDs, public feature flags).
        </p>
        <p>
          <strong>Runtime Configuration:</strong> Variables are fetched from a JSON endpoint or configuration service when the app starts. Advantages: configuration can change without rebuilding (update config.json, no rebuild needed), different configurations for the same build (same bundle, different config per customer or region), dynamic feature toggling. Limitations: runtime overhead (fetch configuration before app starts), complexity (handle fetch failures, loading states, cache configuration), delayed application startup (must wait for config fetch). Best for: configuration that changes frequently, multi-tenant applications, A/B testing scenarios.
        </p>

        <h3>Security vs. Convenience</h3>
        <p>
          <strong>Strict Prefixing:</strong> Only expose variables with a specific prefix (VITE_ in Vite). Advantages: prevents accidental exposure of sensitive variables, security-by-default (variables are private unless explicitly prefixed). Limitations: developers must remember to prefix variables, slightly more verbose variable names. Best for: applications with strict security requirements, teams where developers may not be security-conscious.
        </p>
        <p>
          <strong>Explicit Declaration:</strong> Only expose variables explicitly listed in build configuration (DefinePlugin in Webpack). Advantages: complete control over every exposed variable, audit trail (every exposed variable is documented in configuration). Limitations: more configuration to maintain, easy to forget variables when adding new ones. Best for: enterprise applications with security audits, regulated industries.
        </p>
        <p>
          <strong>Automatic Exposure:</strong> All environment variables are exposed to the client. Advantages: simplest configuration (no prefixes, no explicit declarations). Limitations: high risk of accidentally exposing secrets, no safety net. Best for: internal tools where security is not a concern (not recommended for production applications).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/build-deployment/multi-env-config.svg"
          alt="Multi-Environment Configuration showing development, staging, and production environments with their respective variable values"
          caption="Multi-environment configuration — development (local APIs, debug mode), staging (staging APIs, limited features), production (production APIs, all features enabled)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Correct Prefix Convention:</strong> Follow your build tool&apos;s prefix convention (VITE_ for Vite, explicit DefinePlugin for Webpack). Never store sensitive values in frontend environment variables, even with a prefix — remember that all frontend variables are public. Use environment variables only for public configuration (API URLs, analytics IDs, public feature flags).
          </li>
          <li>
            <strong>Validate Required Variables:</strong> Add validation at the start of the build process to ensure all required variables are present and correctly formatted. Check for presence (variable is not empty), type (variable is a valid number, URL, or boolean), and format (URL is valid, API key has correct format). This prevents builds from succeeding with missing or invalid configuration, which would produce broken deployments.
          </li>
          <li>
            <strong>Separate Public and Secret Variables:</strong> Maintain a clear distinction between public variables (safe for frontend, embedded in bundle) and secret variables (must stay on backend). Document which variables are public and which are secret, enforce this distinction in code review, and use build tool prefixing to prevent accidental exposure of secrets.
          </li>
          <li>
            <strong>Use Environment-Specific Files:</strong> Maintain separate .env files for each environment (.env.development, .env.staging, .env.production). This ensures that each environment has its own configuration and prevents accidentally using production configuration in development or vice versa. Store environment files in version control for development defaults and use CI/CD secrets for production values.
          </li>
          <li>
            <strong>Consider Runtime Configuration for Dynamic Values:</strong> For configuration that changes frequently (feature flags, A/B test variants, customer-specific settings), consider runtime configuration instead of build-time injection. Fetch configuration from a JSON endpoint when the app starts, cache it in localStorage for subsequent visits, and handle fetch failures gracefully. This allows changing configuration without rebuilding.
          </li>
          <li>
            <strong>Document All Environment Variables:</strong> Maintain a list of all environment variables, their purpose, expected format, and whether they are public or secret. This documentation is essential for new team members, code reviewers, and security auditors. Include the documentation in the project README or a dedicated configuration guide.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Exposing Secrets:</strong> Accidentally including sensitive values (API keys, database credentials, passwords) in frontend environment variables. Since these values are embedded in the bundle, anyone can read them. Always keep secrets on the backend and access them via authenticated API calls. Use environment variable prefixing and code review to prevent accidental exposure.
          </li>
          <li>
            <strong>Assuming Variables Update Without Rebuild:</strong> Changing an environment variable and expecting the running application to pick up the change. Since variables are injected at build time, changing them requires a rebuild and redeploy. If you need to change configuration without rebuilding, use runtime configuration instead.
          </li>
          <li>
            <strong>Missing Variable Validation:</strong> Builds succeeding with missing or invalid environment variables, producing broken deployments. For example, a missing API URL causes all API calls to fail, but the build succeeds because the variable reference is simply replaced with an empty string. Always validate required variables before the build starts.
          </li>
          <li>
            <strong>Using Wrong Environment File:</strong> Accidentally using production environment variables in development or staging builds. This happens when the build mode is not correctly set (e.g., building with production mode in development). Ensure that the build process automatically selects the correct .env file based on the build mode.
          </li>
          <li>
            <strong>Not Handling Missing Runtime Configuration:</strong> For runtime configuration, not handling the case where the configuration fetch fails (network error, missing config.json). This causes the application to crash on startup. Always provide fallback values, display an error message, and retry the fetch.
          </li>
          <li>
            <strong>Inconsistent Variable Names Across Environments:</strong> Using different variable names in different environments (e.g., API_URL in development, API_ENDPOINT in production). This causes confusion and makes it difficult to maintain consistent configuration. Use the same variable names across all environments, only changing the values.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Multi-Environment API Configuration</h3>
        <p>
          Frontend applications use environment variables to configure API endpoints per environment. Development uses local API servers (localhost:3000), staging uses staging APIs (staging-api.example.com), and production uses production APIs (api.example.com). Environment variables ensure that the correct endpoint is used in each environment without code changes. Build tool automatically loads the appropriate .env file based on the build mode, replacing the variable reference with the correct endpoint.
        </p>

        <h3>Analytics and Monitoring Configuration</h3>
        <p>
          Analytics services (Google Analytics, Mixpanel, Sentry) use different tracking IDs and project IDs per environment. Development may disable analytics entirely, staging uses test analytics accounts, and production uses production analytics. Environment variables configure these values at build time, ensuring that development activity does not pollute production analytics and that production analytics are correctly attributed.
        </p>

        <h3>Feature Flag Management</h3>
        <p>
          Feature flags (enabling or disabling features per environment) are commonly configured via environment variables. Development may have all features enabled for testing, staging has features enabled incrementally for testing, and production has only stable features enabled. Environment variables allow enabling or disabling features without code changes, and the build tool ensures that the correct feature flags are baked into each environment&apos;s bundle.
        </p>

        <h3>Runtime Configuration for SaaS Products</h3>
        <p>
          SaaS products (multi-tenant applications) use runtime configuration to serve different configurations for different customers from the same build. When the app starts, it fetches configuration from a customer-specific endpoint (config.example.com/customer-id), which returns API endpoints, feature flags, branding settings, and other customer-specific settings. This allows a single build to serve multiple customers with different configurations, without needing separate builds per customer.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between build-time and runtime environment variables?
            </p>
            <p className="mt-2 text-sm">
              A: Build-time environment variables are injected during the build process — the build tool replaces variable references in source code with actual values before generating the bundle. Changing a build-time variable requires rebuilding the application. Runtime environment variables are fetched when the application starts (from a JSON endpoint or configuration service), allowing configuration changes without rebuilding. Build-time has zero runtime overhead and simple implementation but requires rebuilds for changes. Runtime has flexibility (change config without rebuild) but adds complexity (fetch logic, error handling, delayed startup).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why are frontend environment variables considered public?
            </p>
            <p className="mt-2 text-sm">
              A: Frontend environment variables are embedded in the JavaScript bundle during the build process. The bundle is downloaded and executed by the browser, and anyone can inspect the source code to see the variable values. This means that all frontend environment variables are public — visible to anyone who inspects the bundle. Therefore, never include secrets (API keys, database credentials, passwords) in frontend environment variables. Only include public configuration (API URLs, analytics IDs, public feature flags). Any value that should remain secret must be kept on the backend and accessed via authenticated API calls.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do different build tools handle environment variables?
            </p>
            <p className="mt-2 text-sm">
              A: Webpack uses DefinePlugin to replace process.env.VAR_NAME with actual values — variables must be explicitly defined, giving precise control over what is exposed. Vite uses import.meta.env.VAR_NAME and only exposes variables prefixed with VITE_ (security measure to prevent accidental exposure of sensitive variables). Rollup uses rollup-plugin-replace for simple string replacement. Each tool has different conventions, and understanding these conventions is essential for configuring environment variables correctly. Vite&apos;s prefix convention is the most secure-by-default, while Webpack&apos;s explicit declaration provides the most control.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you validate environment variables in a build pipeline?
            </p>
            <p className="mt-2 text-sm">
              A: Add a validation step at the start of the build process (before the build tool runs). Check for presence (required variables are not empty), type (variables are valid numbers, URLs, booleans), and format (URLs are valid, API keys have correct format). Fail the build if any validation fails, displaying a clear error message indicating which variable failed and why. This prevents builds from succeeding with missing or invalid configuration, which would produce broken deployments. In CI/CD pipelines, validation should run as a separate job before the build job, so that configuration errors are caught early.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you use runtime configuration instead of build-time injection?
            </p>
            <p className="mt-2 text-sm">
              A: Use runtime configuration when: configuration changes frequently (updating config.json is faster than rebuilding), you need different configurations for the same build (multi-tenant applications, customer-specific settings), you need dynamic feature toggling (enable or disable features without rebuilding), or you need A/B testing (different users get different configuration). Use build-time injection when: configuration rarely changes (API endpoints, analytics IDs), you want zero runtime overhead, you want simple implementation, and you do not need to change configuration between deployments.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent accidentally exposing secrets in frontend environment variables?
            </p>
            <p className="mt-2 text-sm">
              A: Strategies: use build tool prefixing (VITE_ prefix in Vite) to explicitly control which variables are exposed, maintain a clear distinction between public and secret variables in documentation, enforce this distinction in code review (reviewers check that no secrets are in frontend variables), use CI/CD secrets for sensitive values (never store secrets in .env files in version control), and use automated tools (linting rules, security scanners) to detect potential secret exposure. The most important principle is: if it should be secret, it should not be in the frontend — keep it on the backend and access it via authenticated API calls.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://vitejs.dev/guide/env-and-mode.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Vite — Environment Variables and Modes
            </a>
          </li>
          <li>
            <a
              href="https://webpack.js.org/plugins/define-plugin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Webpack — DefinePlugin
            </a>
          </li>
          <li>
            <a
              href="https://create-react-app.dev/docs/adding-custom-environment-variables/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Create React App — Custom Environment Variables
            </a>
          </li>
          <li>
            <a
              href="https://12factor.net/config"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              The Twelve-Factor App — Config
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/environment-variables/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Environment Variables
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
