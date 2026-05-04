export type Event<T> = { id: string; ts: number; payload: T };

export type Subscription = { unsubscribe: () => void };

export type StreamClient<T> = {
  subscribe: (onEvent: (e: Event<T>) => void) => Subscription;
};

