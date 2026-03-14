export type ArticleMetadata = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  slug: string;
  // Some content files distinguish between "concise" and "extensive" variants.
  // Keep optional so older/newer content can coexist without breaking builds.
  version?: "concise" | "extensive";
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
