"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-multi-tenant-ui",
  title: "Design Multi-Tenant UI",
  description:
    "Production-grade multi-tenant interface with organization switching, role-based access, white-label theming, and data isolation.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "multi-tenant-ui",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "multi-tenant", "organization", "rbac", "data-isolation"],
  relatedTopics: ["settings-page-system", "audit-log-viewer-ui"],
};

export default function MultiTenantUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Multi-tenancy is the architecture where a single application instance serves multiple customers (organizations, teams, companies), each isolated from one another. From the user's perspective, they log in to their organization's workspace and see only their organization's data, users, and configuration. A user who belongs to two organizations (e.g., a consultant who works with multiple clients) must be able to switch between organization contexts without logging out and back in—and the switch must be complete: all data, navigation, and permissions change to reflect the new organization.</p>
        <p>The frontend challenges in multi-tenancy are: organization context is a first-class part of the application state that affects every API call, every permission check, and every UI element. Switching organizations must clear all cached data from the previous organization to prevent leakage. The URL structure must include the organization context (so bookmarks and shared links work correctly). Role-based access within an organization (admin, member, viewer) must be enforced in the UI to show or hide features and actions that the user is not authorized to use in the current organization. White-label customers may expect custom branding (logo, colors, domain) that changes with the organization context.</p>
        <p><strong>Explicit assumptions:</strong> Users can belong to multiple organizations. Organization context is stored in the JWT (orgId claim) for the active session. Switching organizations requires re-authentication (a new JWT with the new orgId). URL structure is /org/:orgSlug/* for all organization-scoped routes. Role-based access is enforced both server-side (API authorization) and client-side (UI visibility). Custom branding (logo, primary color) is configurable per organization.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Organization switcher:</strong> A UI element (typically in the top-left corner) shows the current organization and allows switching to other organizations the user belongs to.</li>
          <li><strong>URL-scoped routing:</strong> All organization-specific routes include the orgSlug in the URL path. Navigation within an organization preserves the orgSlug.</li>
          <li><strong>Role-based access control:</strong> UI elements (buttons, nav items, entire pages) are shown or hidden based on the user's role in the current organization.</li>
          <li><strong>Complete context switch:</strong> Switching organizations clears all cached data from the previous organization and re-fetches data for the new organization.</li>
          <li><strong>White-label branding:</strong> Organization-specific logo, primary color, and custom domain are applied to the UI for the current organization context.</li>
          <li><strong>Cross-organization navigation:</strong> Users can deep-link to a specific resource in a specific organization (/org/acme/projects/123); the app resolves the organization context from the URL.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Data isolation:</strong> Switching organizations must guarantee that no data from the previous organization is accessible in the new context—no cached queries, no leaked state.</li>
          <li><strong>Switch speed:</strong> Organization switch must complete (new data loaded, new branding applied) within 2 seconds.</li>
          <li><strong>Security:</strong> The orgId in the JWT must be validated server-side on every API call; the client-side orgId is untrusted for authorization decisions.</li>
          <li><strong>Consistency:</strong> All UI elements (headers, breadcrumbs, sidebar) must reflect the current organization consistently throughout the session.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>Organization context is a top-level application state that wraps all other state. When the application initializes, it reads the orgSlug from the URL, fetches the organization's details (name, branding, the user's role in this organization), and stores them in a global organization context. All API calls include the current orgId (from the JWT or as a URL path segment). All RBAC checks read from the organization context's role data.</p>
        <p>Organization switching is implemented as a full context reset: when the user selects a different organization, the application requests a new JWT for that organization (server issues a new token with the new orgId claim), clears all organization-specific cache (React Query cache, Zustand store slices, localStorage cached data), updates the URL to the new organization's base path (/org/new-org-slug/), and re-fetches the new organization's context data. This is equivalent to a page navigation to a different site, just without a full browser reload.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/multi-tenant-ui.svg"
          alt="Multi-tenant UI showing orgId in JWT claims, organization switcher with cache clear and re-auth, URL scoping at /org/:slug, RBAC role hierarchy, white-label CSS variable theming, and server-side data isolation"
          caption="Multi-tenant UI showing orgId in JWT claims, organization switcher with cache clear and re-auth, URL scoping at /org/:slug, RBAC role hierarchy, white-label CSS variable theming, and server-side data isolation"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Organization Context and JWT Design</h3>
        <p>The JWT issued after login includes: userId, email, orgId (the organization the token is scoped to), orgSlug (for URL construction), role (the user's role in this organization: owner, admin, member, viewer), and standard JWT claims (iss, exp, iat). The orgId in the JWT is the authoritative source for server-side authorization—every API endpoint that operates on organization data validates that the requested organization's data matches the orgId in the JWT. A user cannot access another organization's data by changing the URL slug—the server rejects requests where the URL org doesn't match the JWT's orgId.</p>
        <p>For users who belong to multiple organizations, the auth server issues organization-specific JWTs. Switching organizations requires exchanging the current JWT for a new one scoped to the target organization. The exchange endpoint authenticates the request with the current JWT and returns a new JWT if the user is a member of the target organization. This re-authentication step is explicit and logged (for audit purposes: switching organizations is a significant context change that should be visible in audit logs).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">URL Structure and Routing</h3>
        <p>The URL structure for multi-tenant applications follows the pattern /org/:orgSlug/* for all organization-scoped routes. The orgSlug is the human-readable identifier for the organization (e.g., "acme-corp", "beta-team"). This makes URLs shareable within an organization (copy the URL, send to a colleague, they open the same resource in the same organization context) and allows bookmarking specific resources.</p>
        <p>On navigation to an organization-scoped URL, the router extracts the orgSlug from the URL and compares it to the current organization context. If they match, no context switch is needed. If they differ (the user navigated directly to a URL for a different organization), the router triggers a context switch to the new organization (requesting a new JWT for that organization, if the user is a member). If the user is not a member of the URL's organization, they see a "You don't have access to this organization" error page with a link to their own organizations.</p>
        <p>Deep links to specific resources within an organization (e.g., /org/acme/projects/123) must work correctly even when the user's current session is scoped to a different organization. The router handles this: detect the organization mismatch, switch context to the linked organization, then navigate to the specific resource. The user sees a brief loading state during the context switch before arriving at the linked resource.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Organization Switcher UI</h3>
        <p>The organization switcher is typically a dropdown in the top-left corner, showing the current organization's logo and name. Clicking opens a list of organizations the user belongs to. The list shows organization name, logo, and the user's role in that organization. Searching is available for users belonging to many organizations (power users at large companies may have 10+ organization memberships).</p>
        <p>Switching flow: user clicks the target organization → confirmation is not required (switching is low-stakes; the user can switch back) → loading indicator appears while the JWT exchange and data fetch complete → once loaded, the new organization's data and branding are applied, the URL updates to the new org's base path. The previous organization's data is entirely cleared from client state. If the switch fails (network error, the user is no longer a member), an error toast is shown and the current organization context is preserved.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">RBAC Enforcement in the UI</h3>
        <p>The organization context includes the current user's role (owner, admin, member, viewer) and the organization's feature flags. A permission system maps (role, action) pairs to boolean values: can(role, "invite_members"), can(role, "delete_project"), can(role, "view_billing"). These permission checks are evaluated throughout the UI: the "Invite Members" button is rendered only if can(currentRole, "invite_members") is true; the Billing nav item is shown only if can(currentRole, "view_billing") is true.</p>
        <p>UI-level RBAC is a UX improvement, not a security control. The server must independently authorize every request. A user who manually navigates to /org/acme/settings/billing will see the page only if the server returns data for it; the server checks the JWT's role claim against the billing resource's required role, regardless of whether the UI showed the billing nav link. "Security through obscurity" (hiding UI elements) is never sufficient—the server authorization is the real gate.</p>
        <p>The permission system should be centralized (a single permissionsForRole(role) function that returns all allowed actions) rather than scattered (individual if (role === 'admin') checks throughout the codebase). Centralization ensures consistency (the billing nav and the billing API check the same permission definition) and simplifies auditing (the full permission matrix is visible in one place). Permissions change over time (new features require new permissions); centralization makes these changes safe.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">White-Label Branding</h3>
        <p>Organization-specific branding (logo, primary color, font) is applied via CSS custom properties (CSS variables). On organization context load, the application fetches the organization's branding configuration and sets CSS variables on the root element: document.documentElement.style.setProperty('--color-primary', org.brandColor). All themed UI elements reference --color-primary (and other defined tokens) rather than hardcoded hex values. This allows the entire application's color scheme to change with a single JavaScript operation on organization switch.</p>
        <p>Custom domains (acme.yoursaas.com) require DNS-level configuration and server-side certificate provisioning (Let's Encrypt wildcard certificates or per-tenant certificates). The application server resolves the tenant from the subdomain or custom domain and issues a JWT pre-scoped to that organization. The frontend doesn't need to handle custom domain resolution—it just uses the organization context from the JWT. Custom domain support is primarily a server and infrastructure concern, not a frontend one; the frontend only needs to display the correct branding.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cache Invalidation on Organization Switch</h3>
        <p>When the organization context changes, all cached organization-specific data must be invalidated. In React Query (or SWR), queries are keyed with the orgId: ["projects", orgId], ["members", orgId]. When orgId changes, these cache keys become stale. Calling queryClient.clear() removes all cached queries; alternatively, queryClient.invalidateQueries() marks all queries as stale without removing them (they'll refetch on next use). The difference: clear() produces loading states everywhere on switch; invalidateQueries() produces stale-while-revalidating states (the old data is briefly shown, then replaced with the new organization's data). For multi-tenant switches, clear() is safer to avoid showing wrong-organization data even briefly—the user should see a clean loading state, not flashes of the previous organization's content.</p>
        <p>Zustand stores with organization-specific state (e.g., selectedProjectId, which is meaningless after an organization switch) must reset their organization-specific slices on context switch. A convention: organize the store's organization-specific state into a nested slice and call a resetOrgState() action on switch. This action resets only the organization-scoped slices, leaving user-level state (theme, UI preferences) intact.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>JWT per organization versus a single JWT with organization claims list: a single JWT that includes the user's full organization membership list (orgIds: ["org-1", "org-2", "org-3"]) allows the server to authorize cross-organization operations without a token exchange. The trade-off is JWT size (large organizations may have users in dozens of orgs, making the JWT very large) and staleness (organization membership changes require re-issuing the JWT). Per-organization JWTs are smaller and more current but require a token exchange on every switch. Most multi-tenant SaaS applications use per-organization tokens because the organization membership change case is important for security (a user who is removed from an organization should lose access immediately on the next API call, not after their multi-org JWT expires).</p>
        <p>Path-based versus subdomain-based tenant routing: path-based routing (/org/acme/*) works on any domain and requires no DNS configuration per tenant. Subdomain routing (acme.yoursaas.com) provides stronger isolation appearance, enables custom domains easily, and is expected by enterprise customers. Path-based is simpler to implement and appropriate for smaller products. Subdomain routing is worth the complexity for enterprise SaaS where customers expect (and sometimes require) branded subdomains.</p>
        <p>Permission granularity: coarse-grained permissions (owner/admin/member/viewer) are simple to implement and reason about. Fine-grained permissions (each action independently controlled) are more flexible but exponentially more complex to manage and audit. Most applications start coarse-grained and add fine-grained permissions (custom roles, per-resource access controls) only when driven by specific customer requirements. Avoid over-engineering the permission model before those requirements are clearly understood.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A multi-tenant UI centers on the organization context: a JWT scoped to a single organization (orgId, role claims), URL routing under /org/:orgSlug/*, and a centralized permission system mapping (role, action) to boolean. Organization switching requires a JWT exchange (re-authentication to the new org), complete cache invalidation (queryClient.clear(), Zustand org-state reset), URL update, and new branding application via CSS custom properties. RBAC enforcement in the UI (showing/hiding elements by role) is a UX improvement only; server-side authorization is the security control. White-label branding via CSS variables allows the entire application theme to change with a single document.documentElement.style.setProperty call on organization switch. Deep links to cross-organization resources trigger a context switch before navigation. The defining invariant: the current orgId in the JWT must match the current URL's orgSlug at all times; any mismatch is detected by the router and triggers a context switch or authorization error.</p>
      </section>
    </ArticleLayout>
  );
}
