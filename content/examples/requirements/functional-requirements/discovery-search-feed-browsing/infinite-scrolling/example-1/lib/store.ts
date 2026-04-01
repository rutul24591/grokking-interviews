export type FeedCard = {
  id: string;
  title: string;
  lane: "for-you" | "trending" | "continue-reading";
  score: number;
};

const allCards: FeedCard[] = [
  { id: "card-1", title: "Discovery card 1", lane: "for-you", score: 0.94 },
  { id: "card-2", title: "Discovery card 2", lane: "trending", score: 0.88 },
  { id: "card-3", title: "Discovery card 3", lane: "continue-reading", score: 0.82 },
  { id: "card-4", title: "Discovery card 4", lane: "for-you", score: 0.79 },
  { id: "card-5", title: "Discovery card 5", lane: "trending", score: 0.76 },
  { id: "card-6", title: "Discovery card 6", lane: "for-you", score: 0.72 },
  { id: "card-7", title: "Discovery card 7", lane: "continue-reading", score: 0.69 },
  { id: "card-8", title: "Discovery card 8", lane: "trending", score: 0.66 }
];

export type InfiniteState = {
  cursor: number;
  pageSize: number;
  bufferedIds: string[];
  visibleIds: string[];
  hasMore: boolean;
  prefetchReady: boolean;
  lastEvent: "initial-load" | "prefetch" | "append" | "end-of-feed";
  lastMessage: string;
};

export const infiniteState: InfiniteState = {
  cursor: 0,
  pageSize: 3,
  bufferedIds: allCards.slice(0, 5).map((item) => item.id),
  visibleIds: allCards.slice(0, 3).map((item) => item.id),
  hasMore: true,
  prefetchReady: true,
  lastEvent: "initial-load",
  lastMessage: "Initial cards loaded and the next slice is already prefetched."
};
export { allCards };
