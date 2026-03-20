export type ArticleSummary = {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: string;
};

export type ArticleListResponse = {
  items: ArticleSummary[];
  nextCursor: string | null;
};

export type ArticleResponse = {
  id: string;
  title: string;
  updatedAt: string;
  body: string;
};

