# CDN Caching Examples

## Example 1: CDN Cache Headers Configuration (Nginx)

```nginx
server {
    # Static assets - long-term cache with content hash
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header CDN-Cache-Control "public, max-age=31536000";
    }

    # HTML pages - short cache at edge, always revalidate at browser
    location ~* \.html$ {
        add_header Cache-Control "public, no-cache";
        add_header CDN-Cache-Control "public, s-maxage=60";
        add_header Surrogate-Key "html-pages";
    }

    # API responses - vary by auth, cache at edge
    location /api/ {
        add_header Cache-Control "private, no-cache";
        add_header CDN-Cache-Control "public, s-maxage=10";
        add_header Vary "Authorization, Accept-Encoding";
        add_header Surrogate-Key "api-responses";
    }
}
```

## Example 2: Cloudflare Cache API (Edge Worker)

```javascript
export default {
  async fetch(request, env) {
    const cacheUrl = new URL(request.url);
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    // Check cache
    let response = await cache.match(cacheKey);

    if (!response) {
      // Cache miss - fetch from origin
      response = await fetch(request);

      // Only cache successful responses
      if (response.ok) {
        response = new Response(response.body, response);
        response.headers.set('Cache-Control', 's-maxage=3600');
        // Store in cache (non-blocking)
        event.waitUntil(cache.put(cacheKey, response.clone()));
      }
    }

    return response;
  },
};
```

## Example 3: Cache Invalidation via API (Fastly)

```javascript
// Purge by URL
async function purgeUrl(url) {
  await fetch(url, {
    method: 'PURGE',
    headers: { 'Fastly-Key': process.env.FASTLY_API_KEY },
  });
}

// Purge by surrogate key (tag-based)
async function purgeBySurrogateKey(serviceId, key) {
  await fetch(
    `https://api.fastly.com/service/${serviceId}/purge/${key}`,
    {
      method: 'POST',
      headers: {
        'Fastly-Key': process.env.FASTLY_API_KEY,
        'Fastly-Soft-Purge': '1', // Soft purge - mark stale, don't delete
      },
    }
  );
}

// After updating a product
async function onProductUpdate(product) {
  await purgeBySurrogateKey(SERVICE_ID, `product-${product.id}`);
  await purgeBySurrogateKey(SERVICE_ID, 'product-listing');
}
```

## Example 4: Next.js Incremental Cache with CDN

```javascript
// Next.js API route with CDN caching
export async function GET(request) {
  const data = await fetchProducts();

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'CDN-Cache-Control': 'public, max-age=60',
      'Surrogate-Key': 'products',
    },
  });
}

// Revalidation endpoint
export async function POST(request) {
  const { tag } = await request.json();
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}
```
