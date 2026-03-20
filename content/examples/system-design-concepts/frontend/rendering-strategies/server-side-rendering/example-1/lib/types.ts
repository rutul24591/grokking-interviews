export type FeedItem = {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  updatedAt: string;
  personalizedReason?: string;
};

export type FeedResponse = {
  items: FeedItem[];
};

export type ArticleResponse = {
  id: string;
  title: string;
  updatedAt: string;
  body: string;
};

export type ProfileResponse = {
  uid: string;
  displayName: string;
  plan: "free" | "pro";
};

