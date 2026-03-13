export type ArticleMetadata = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  slug: string;
  wordCount: number;
  readingTime: number; // minutes
  lastUpdated: string;
  tags: string[];
  relatedTopics?: string[]; // slugs of related articles
};

export type ArticleRegistry = {
  [path: string]: {
    metadata: ArticleMetadata;
    loader: () => Promise<{ default: React.ComponentType }>;
  };
};
