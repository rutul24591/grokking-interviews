export type DocSummary = {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
};

export type Doc = DocSummary & {
  sections: Array<{ id: string; heading: string; body: string; bullets?: string[] }>;
};

const DOCS: Doc[] = [
  {
    slug: "landmarks",
    title: "Landmarks",
    description: "How <header>/<nav>/<main>/<footer> make pages navigable for assistive tech.",
    updatedAt: "2026-03-24",
    sections: [
      {
        id: "main",
        heading: "One main landmark",
        body: "Use one <main> per page. Screen reader users can jump directly to it."
      },
      {
        id: "nav",
        heading: "Navigation blocks",
        body: "Wrap primary nav, breadcrumbs, and in-page TOCs in <nav> with clear aria-labels."
      }
    ]
  },
  {
    slug: "content-boundaries",
    title: "Content boundaries",
    description: "Use <article>, <section>, and <aside> to express content vs supporting material.",
    updatedAt: "2026-03-24",
    sections: [
      {
        id: "article",
        heading: "Article is primary content",
        body: "Use <article> for the main, self-contained content unit (docs page, blog post, product description)."
      },
      {
        id: "aside",
        heading: "Asides are optional",
        body: "Use <aside> for related links, tips, and widgets that should not interrupt the primary reading flow.",
        bullets: ["Related docs", "Table of contents", "Announcements"]
      }
    ]
  }
];

export function listDocs(): DocSummary[] {
  return DOCS.map(({ sections: _sections, ...rest }) => rest);
}

export function getDocBySlug(slug: string): Doc | null {
  return DOCS.find((d) => d.slug === slug) ?? null;
}

