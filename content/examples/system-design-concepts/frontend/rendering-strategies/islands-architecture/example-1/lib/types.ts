export type Article = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export type BookmarksResponse = {
  uid: string;
  bookmarkedIds: string[];
  ts: string;
};

