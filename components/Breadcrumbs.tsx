"use client";

import { usePathname, useRouter } from "next/navigation";
import { sidebarData } from "@/features/sidebar/sidebar.mock";
import { useSidebarStore } from "@/features/sidebar/sidebar.store";
import { classNames } from "@/lib/classNames";
import { unslugify } from "@/lib/slugify";

export function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();

  const setNavigationState = useSidebarStore(
    (state) => state.setNavigationState,
  );

  const category = sidebarData[0];

  const segments = pathname.split("/").filter(Boolean);

  let crumbs: Array<{ label: string | null; onClick: (() => void) | null }> = [];

  // Build breadcrumbs from URL segments
  if (segments.length >= 1) {
    const [categorySlug, subcategorySlug, topicSlug] = segments;

    crumbs = [
      {
        label: category?.name ?? "Home",
        onClick: () => {
          setNavigationState(null, null, null);
          router.push("/");
        },
      },
      {
        label: unslugify(categorySlug),
        onClick: segments.length > 1
          ? () => {
              const categoryId = categorySlug === "frontend" ? "sub-frontend" : "sub-backend";
              setNavigationState(categoryId, null, null);
              router.push(`/${categorySlug}`);
            }
          : null,
      },
    ];

    if (subcategorySlug) {
      crumbs.push({
        label: unslugify(subcategorySlug),
        onClick: segments.length > 2
          ? () => {
              const categoryId = categorySlug === "frontend" ? "sub-frontend" : "sub-backend";
              const subcategoryItemId = `sub-${categorySlug}-${subcategorySlug}`;
              setNavigationState(categoryId, subcategoryItemId, null);
              router.push(`/${categorySlug}/${subcategorySlug}`);
            }
          : null,
      });
    }

    // Add topic if present (not on extensive version path)
    if (topicSlug && topicSlug !== "extensive") {
      crumbs.push({
        label: unslugify(topicSlug),
        onClick: null,
      });
    }
  } else {
    // Home page - just show category name
    crumbs = [
      {
        label: category?.name ?? null,
        onClick: null,
      },
    ];
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs font-semibold uppercase tracking-[0.25em]"
    >
      <ol className="flex flex-wrap items-center gap-2 text-muted">
        {crumbs.map((crumb, index) => (
          <li
            key={`${crumb.label}-${index}`}
            className="flex items-center gap-2"
          >
            {crumb.onClick ? (
              <button
                type="button"
                onClick={crumb.onClick}
                className={classNames(
                  "cursor-pointer transition hover:text-heading",
                  index === crumbs.length - 1
                    ? "text-heading"
                    : "",
                )}
              >
                {crumb.label}
              </button>
            ) : (
              <span
                className={classNames(
                  index === crumbs.length - 1
                    ? "text-heading"
                    : "",
                )}
              >
                {crumb.label}
              </span>
            )}
            {index < crumbs.length - 1 && <span aria-hidden>›</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
