# Server State Management Examples

## Example 1: React Query - Queries and Mutations

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductPage({ productId }) {
  const queryClient = useQueryClient();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetch(`/api/products/${productId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (updates) =>
      fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }).then(r => r.json()),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ['product', productId] });
      const previous = queryClient.getQueryData(['product', productId]);
      queryClient.setQueryData(['product', productId], old => ({ ...old, ...updates }));
      return { previous };
    },
    onError: (err, updates, context) => {
      queryClient.setQueryData(['product', productId], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState error={error} />;
  return <ProductDetail product={product} onUpdate={updateMutation.mutate} />;
}
```

## Example 2: SWR with Revalidation

```javascript
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(r => r.json());

function NotificationBell() {
  const { data, mutate } = useSWR('/api/notifications/unread', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  const markAsRead = async (id) => {
    // Optimistic update
    mutate(
      data.filter(n => n.id !== id),
      false // don't revalidate yet
    );
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    mutate(); // revalidate
  };

  return <NotificationList items={data} onRead={markAsRead} />;
}
```

## Example 3: Infinite Query (Pagination)

```javascript
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 0 }) =>
      fetch(`/api/feed?cursor=${pageParam}&limit=20`).then(r => r.json()),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 60 * 1000,
  });

  const allPosts = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <VirtualList
      items={allPosts}
      onEndReached={() => hasNextPage && fetchNextPage()}
      footer={isFetchingNextPage ? <Spinner /> : null}
    />
  );
}
```

## Example 4: Dependent Queries

```javascript
function UserDashboard({ userId }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Only fetch projects once we have the user's team ID
  const { data: projects } = useQuery({
    queryKey: ['projects', user?.teamId],
    queryFn: () => fetchProjects(user.teamId),
    enabled: !!user?.teamId, // Won't execute until user is loaded
  });

  return <Dashboard user={user} projects={projects} />;
}
```
