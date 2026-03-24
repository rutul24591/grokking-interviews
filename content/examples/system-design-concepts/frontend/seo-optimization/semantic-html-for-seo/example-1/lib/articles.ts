export type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
};

export type Article = ArticleSummary & {
  sections: Array<{
    id: string;
    heading: string;
    body: string;
    bullets?: string[];
  }>;
};

const ARTICLES: Article[] = [
  {
    slug: "landmarks-and-content-extraction",
    title: "Landmarks & content extraction",
    description: "How crawlers distinguish boilerplate from primary content using semantics.",
    publishedAt: "2026-03-24",
    updatedAt: "2026-03-24",
    readingMinutes: 7,
    sections: [
      {
        id: "why-landmarks-matter",
        heading: "Why landmarks matter",
        body: "Search engines and assistive tech look for a dominant content region. A single <main> plus meaningful sectioning makes it cheaper and more reliable to extract the content that should rank."
      },
      {
        id: "avoid-div-soup",
        heading: "Avoid “div soup”",
        body: "If everything is a div, crawlers infer structure from CSS and link density. Semantics make intent explicit and reduce misclassification.",
        bullets: ["Use <header>/<footer> for repeated chrome.", "Use <article> for self-contained content.", "Use <aside> for tangential content."]
      },
      {
        id: "toc-and-breadcrumbs",
        heading: "TOC and breadcrumbs",
        body: "TOCs and breadcrumbs are navigation, not content. Wrapping them in <nav> is a strong signal and improves both UX and crawler understanding."
      }
    ]
  },
  {
    slug: "heading-hierarchy-at-scale",
    title: "Heading hierarchy at scale",
    description: "Design-system patterns that keep heading structure consistent across hundreds of pages.",
    publishedAt: "2026-03-24",
    updatedAt: "2026-03-24",
    readingMinutes: 6,
    sections: [
      {
        id: "one-h1",
        heading: "One h1 per page",
        body: "A single top-level heading keeps the topic explicit. Repeated h1s in cards/sidebars can confuse both outline parsing and snippets."
      },
      {
        id: "sections-need-headings",
        heading: "Sections need headings",
        body: "A <section> without a heading is usually a div in disguise. Pair each sectioning element with a heading to communicate topic boundaries."
      }
    ]
  }
];

export function listArticles(): ArticleSummary[] {
  return ARTICLES.map(({ sections: _sections, ...summary }) => summary);
}

export function getArticleBySlug(slug: string): Article | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

