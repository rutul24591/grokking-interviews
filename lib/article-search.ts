import sidebarData from "@/lib/sidebar-data.json";
import { subcategoryArticles } from "@/lib/subcategory-articles";

type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
};

type SidebarSubcategory = {
  name: string;
  slug: string;
};

type SidebarCategory = {
  name: string;
  slug: string;
  subcategories: SidebarSubcategory[];
};

type SidebarDomain = {
  name: string;
  slug: string;
  categories: SidebarCategory[];
};

type SidebarData = {
  domains: SidebarDomain[];
};

export type ArticleSearchResult = {
  title: string;
  slug: string;
  description: string;
  href: string;
  breadcrumb: string;
  domain: string;
  category: string;
  subcategory: string;
};

type IndexedArticle = ArticleSearchResult & {
  normalizedTitle: string;
  normalizedPath: string;
  normalizedSearchText: string;
  titleTokens: string[];
  pathTokens: string[];
};

const MAX_RESULTS = 100;

const typedSidebarData = sidebarData as SidebarData;

const pathNameByKey = buildPathNameMap(typedSidebarData);
const searchIndex = buildSearchIndex();

export function searchArticles(query: string): ArticleSearchResult[] {
  const normalizedQuery = normalizeText(query);
  const tokens = tokenize(normalizedQuery);

  if (tokens.length === 0) {
    return [];
  }

  return searchIndex
    .map((item) => ({ item, score: scoreArticle(item, tokens, normalizedQuery) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, MAX_RESULTS)
    .map(({ item }) => ({
      title: item.title,
      slug: item.slug,
      description: item.description,
      href: item.href,
      breadcrumb: item.breadcrumb,
      domain: item.domain,
      category: item.category,
      subcategory: item.subcategory,
    }));
}

export function getSearchResultLimit() {
  return MAX_RESULTS;
}

function buildSearchIndex(): IndexedArticle[] {
  return Object.entries(subcategoryArticles).flatMap(([subcategoryKey, articles]) => {
    const [domainSlug, categorySlug, subcategorySlug] = subcategoryKey.split("/");
    const names = pathNameByKey.get(subcategoryKey) ?? {
      domain: formatSlug(domainSlug),
      category: formatSlug(categorySlug),
      subcategory: formatSlug(subcategorySlug),
    };

    const breadcrumb = `${names.domain} / ${names.category} / ${names.subcategory}`;
    const normalizedPath = normalizeText(
      `${breadcrumb} ${domainSlug} ${categorySlug} ${subcategorySlug}`,
    );

    return (articles as ArticleSummary[]).map((article) => {
      const normalizedTitle = normalizeText(`${article.title} ${article.slug}`);

      return {
        title: article.title,
        slug: article.slug,
        description: article.description,
        href: `/articles/${domainSlug}/${categorySlug}/${subcategorySlug}/${article.slug}`,
        breadcrumb,
        domain: names.domain,
        category: names.category,
        subcategory: names.subcategory,
        normalizedTitle,
        normalizedPath,
        normalizedSearchText: `${normalizedTitle} ${normalizedPath}`,
        titleTokens: tokenize(normalizedTitle),
        pathTokens: tokenize(normalizedPath),
      };
    });
  });
}

function scoreArticle(
  item: IndexedArticle,
  tokens: string[],
  normalizedQuery: string,
) {
  const allTokensMatch = tokens.every((token) =>
    item.normalizedSearchText.includes(token),
  );

  if (!allTokensMatch) {
    return 0;
  }

  if (item.normalizedTitle === normalizedQuery) {
    return 1000;
  }

  if (item.normalizedTitle.startsWith(`${normalizedQuery} `)) {
    return 800;
  }

  if (hasBoundedPhrase(item.normalizedTitle, normalizedQuery)) {
    return 650;
  }

  const exactTitleTokenMatches = tokens.filter((token) =>
    item.titleTokens.includes(token),
  ).length;
  const exactPathTokenMatches = tokens.filter((token) =>
    item.pathTokens.includes(token),
  ).length;
  const fuzzyTitleTokenMatches = tokens.filter(
    (token) =>
      !item.titleTokens.includes(token) && item.normalizedTitle.includes(token),
  ).length;
  const fuzzyPathTokenMatches = tokens.filter(
    (token) =>
      !item.pathTokens.includes(token) && item.normalizedPath.includes(token),
  ).length;

  return (
    exactTitleTokenMatches * 120 +
    fuzzyTitleTokenMatches * 80 +
    exactPathTokenMatches * 40 +
    fuzzyPathTokenMatches * 20
  );
}

function buildPathNameMap(data: SidebarData) {
  const map = new Map<
    string,
    { domain: string; category: string; subcategory: string }
  >();

  for (const domain of data.domains) {
    for (const category of domain.categories) {
      for (const subcategory of category.subcategories) {
        map.set(`${domain.slug}/${category.slug}/${subcategory.slug}`, {
          domain: domain.name,
          category: category.name,
          subcategory: subcategory.name,
        });
      }
    }
  }

  return map;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokenize(value: string) {
  return value.split(" ").filter(Boolean);
}

function hasBoundedPhrase(value: string, phrase: string) {
  return value === phrase || value.startsWith(`${phrase} `) || value.includes(` ${phrase} `);
}

function formatSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
