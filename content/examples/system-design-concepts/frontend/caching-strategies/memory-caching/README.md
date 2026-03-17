# Memory Caching Examples

## Example 1: Simple In-Memory Cache with TTL

```javascript
class MemoryCache {
  constructor(defaultTTL = 60000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  invalidate(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

const apiCache = new MemoryCache(30000); // 30s TTL

async function fetchUser(id) {
  const cacheKey = `user:${id}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  const user = await fetch(`/api/users/${id}`).then(r => r.json());
  apiCache.set(cacheKey, user);
  return user;
}
```

## Example 2: LRU Cache Implementation

```javascript
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Delete oldest entry (first key)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

## Example 3: React Query Cache Usage

```javascript
import { useQuery, useQueryClient, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 30 * 60 * 1000,    // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
});

function UserProfile({ userId }) {
  const { data, isLoading, isStale } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 10 * 60 * 1000, // Consider fresh for 10 min
  });

  if (isLoading) return <Skeleton />;
  return <div>{data.name} {isStale && '(updating...)'}</div>;
}

// Invalidate cache after mutation
function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user) => fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      // Or update cache directly
      queryClient.setQueryData(['user', variables.id], data);
    },
  });
}
```

## Example 4: SWR with Deduplication

```javascript
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(r => r.json());

function Dashboard() {
  // These two hooks share the same cache entry and deduplicate requests
  const { data: user } = useSWR('/api/user', fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 2000, // Deduplicate within 2s
  });

  return <Profile user={user} />;
}

function Sidebar() {
  // Same key = same cached data, no extra request
  const { data: user } = useSWR('/api/user', fetcher);
  return <UserMenu user={user} />;
}
```
