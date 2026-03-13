# Stale-While-Revalidate Examples

## Example 1: HTTP Stale-While-Revalidate Header

```javascript
// Express.js middleware
function swrHeaders(maxAge, swrWindow) {
  return (req, res, next) => {
    res.set(
      'Cache-Control',
      `public, max-age=${maxAge}, stale-while-revalidate=${swrWindow}`
    );
    next();
  };
}

// Product listings: fresh for 60s, serve stale for 5 min while revalidating
app.get('/api/products', swrHeaders(60, 300), async (req, res) => {
  const products = await db.getProducts();
  res.json(products);
});

// User profile: fresh for 0s (always revalidate), serve stale for 30s
app.get('/api/profile', swrHeaders(0, 30), async (req, res) => {
  const profile = await db.getProfile(req.user.id);
  res.json(profile);
});
```

## Example 2: SWR Library (Vercel) with React

```javascript
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

function ProductList() {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    '/api/products',
    fetcher,
    {
      revalidateOnFocus: true,       // Refetch when tab gains focus
      revalidateOnReconnect: true,   // Refetch when network reconnects
      refreshInterval: 30000,        // Poll every 30s
      dedupingInterval: 5000,        // Dedup requests within 5s
      errorRetryCount: 3,
      fallbackData: [],              // Initial data while loading
    }
  );

  if (error) return <ErrorState error={error} onRetry={() => mutate()} />;
  if (isLoading) return <Skeleton />;

  return (
    <div>
      {isValidating && <RefreshIndicator />}
      {data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## Example 3: React Query SWR Pattern

```javascript
import { useQuery } from '@tanstack/react-query';

function Dashboard() {
  const { data, isFetching } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 30 * 1000,           // Fresh for 30s
    gcTime: 5 * 60 * 1000,          // Keep in cache 5 min after unmount
    refetchOnWindowFocus: 'always',
    refetchInterval: 60 * 1000,      // Background poll every 60s
    placeholderData: (previousData) => previousData, // Keep showing old data
  });

  return (
    <div>
      <h1>Dashboard {isFetching && <Spinner size="sm" />}</h1>
      <MetricsGrid data={data} />
    </div>
  );
}
```

## Example 4: Custom SWR Hook Implementation

```javascript
function useSWRCustom(key, fetcher, options = {}) {
  const { staleTime = 0, cacheTime = 5 * 60 * 1000 } = options;
  const [state, setState] = useState({ data: undefined, error: undefined, isLoading: true });
  const cacheRef = useRef(new Map());

  useEffect(() => {
    const cached = cacheRef.current.get(key);

    // Serve from cache immediately if available
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setState({ data: cached.data, error: undefined, isLoading: false });

      // If stale, revalidate in background
      if (Date.now() - cached.timestamp > staleTime) {
        revalidate();
      }
      return;
    }

    // No cache - fetch
    revalidate();

    async function revalidate() {
      try {
        const data = await fetcher(key);
        cacheRef.current.set(key, { data, timestamp: Date.now() });
        setState({ data, error: undefined, isLoading: false });
      } catch (error) {
        setState((prev) => ({ ...prev, error, isLoading: false }));
      }
    }
  }, [key]);

  return state;
}
```
