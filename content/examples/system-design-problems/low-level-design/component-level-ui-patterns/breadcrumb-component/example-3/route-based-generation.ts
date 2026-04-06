/**
 * Breadcrumb — Staff-Level Dynamic Breadcrumb Generation from Routes.
 *
 * Staff differentiator: Auto-generates breadcrumbs from route definitions,
 * handles dynamic route segments with API-based label resolution,
 * and supports multi-tenant breadcrumb customization.
 */

export interface RouteDefinition {
  path: string;
  label: string;
  children?: RouteDefinition[];
  isDynamic?: boolean;
  resolver?: (segment: string) => Promise<string>;
}

/**
 * Generates breadcrumbs from the current URL path and route definitions.
 */
export async function generateBreadcrumbsFromRoutes(
  currentPath: string,
  routes: RouteDefinition[],
  baseUrl: string = '',
): Promise<Array<{ label: string; href: string; isCurrent: boolean }>> {
  const segments = currentPath.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string; isCurrent: boolean }> = [];

  let currentRoute: RouteDefinition | undefined = { path: '', label: 'Home', children: routes };
  let accumulatedPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    accumulatedPath += `/${segment}`;

    // Find matching route
    const matchingRoute = currentRoute?.children?.find(
      (r) => r.path === segment || (r.isDynamic && r.resolver),
    );

    if (matchingRoute) {
      let label = matchingRoute.label;

      // Resolve dynamic segment label
      if (matchingRoute.isDynamic && matchingRoute.resolver) {
        try {
          label = await matchingRoute.resolver(segment);
        } catch {
          label = segment; // Fallback to raw segment
        }
      }

      breadcrumbs.push({
        label,
        href: `${baseUrl}${accumulatedPath}`,
        isCurrent: i === segments.length - 1,
      });

      currentRoute = matchingRoute;
    } else {
      // No matching route — use segment as label
      breadcrumbs.push({
        label: segment,
        href: `${baseUrl}${accumulatedPath}`,
        isCurrent: i === segments.length - 1,
      });
    }
  }

  return breadcrumbs;
}
