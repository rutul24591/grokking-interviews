# Cache Invalidation Strategies Examples

## Example 1: TTL-Based Invalidation

```javascript
class TTLCache {
  constructor() {
    this.store = new Map();
  }

  set(key, value, ttlMs) {
    const expiry = Date.now() + ttlMs;
    this.store.set(key, { value, expiry });

    // Auto-cleanup
    setTimeout(() => {
      if (this.store.has(key) && this.store.get(key).expiry <= Date.now()) {
        this.store.delete(key);
      }
    }, ttlMs);
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }
}

// Usage: different TTLs for different data types
const cache = new TTLCache();
cache.set('user-profile', userData, 5 * 60 * 1000);  // 5 min
cache.set('product-list', products, 60 * 1000);        // 1 min
cache.set('config', appConfig, 30 * 60 * 1000);        // 30 min
```

## Example 2: Event-Driven Invalidation with React Query

```javascript
import { useQueryClient } from '@tanstack/react-query';

function useRealtimeInvalidation() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com/events');

    ws.onmessage = (event) => {
      const { type, entity, id } = JSON.parse(event.data);

      switch (type) {
        case 'product.updated':
          queryClient.invalidateQueries({ queryKey: ['product', id] });
          queryClient.invalidateQueries({ queryKey: ['products'] });
          break;
        case 'inventory.changed':
          queryClient.invalidateQueries({
            queryKey: ['product', id],
            exact: false, // Also invalidate sub-queries
          });
          break;
        case 'category.updated':
          // Tag-based: invalidate all queries with this predicate
          queryClient.invalidateQueries({
            predicate: (query) =>
              query.queryKey[0] === 'products' &&
              query.queryKey[1]?.categoryId === id,
          });
          break;
      }
    };

    return () => ws.close();
  }, [queryClient]);
}
```

## Example 3: Versioned URL Cache Busting

```javascript
// Build-time: Webpack content hashing
// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',
  },
};

// Runtime: API versioning for cache busting
class VersionedApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.version = null;
  }

  async getVersion() {
    if (!this.version) {
      const res = await fetch(`${this.baseUrl}/version`);
      this.version = await res.text();
    }
    return this.version;
  }

  async fetch(path) {
    const version = await this.getVersion();
    const url = `${this.baseUrl}${path}?v=${version}`;
    return fetch(url);
  }

  // Force cache bust on next request
  bustCache() {
    this.version = null;
  }
}
```

## Example 4: Mutation-Based Invalidation Pattern

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product) => {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
      });
      return res.json();
    },
    // Optimistic update
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: ['product', newProduct.id] });
      const previous = queryClient.getQueryData(['product', newProduct.id]);
      queryClient.setQueryData(['product', newProduct.id], newProduct);
      return { previous };
    },
    onError: (err, newProduct, context) => {
      // Rollback on error
      queryClient.setQueryData(['product', newProduct.id], context.previous);
    },
    onSettled: (data, error, variables) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```
