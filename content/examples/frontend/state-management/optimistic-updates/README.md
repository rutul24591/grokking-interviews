# Optimistic Updates Examples

## Example 1: React Query Optimistic Mutation

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) =>
      fetch(`/api/posts/${postId}/like`, { method: 'POST' }).then(r => r.json()),

    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot previous state
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update
      queryClient.setQueryData(['posts'], (old) =>
        old.map(post =>
          post.id === postId
            ? { ...post, liked: true, likeCount: post.likeCount + 1 }
            : post
        )
      );

      return { previousPosts };
    },

    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts'], context.previousPosts);
      toast.error('Failed to like post');
    },

    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

## Example 2: Optimistic Drag-and-Drop Reorder

```javascript
function useReorderItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, newIndex }) =>
      fetch(`/api/items/${itemId}/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ position: newIndex }),
      }),

    onMutate: async ({ itemId, newIndex }) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData(['items']);

      queryClient.setQueryData(['items'], (old) => {
        const items = [...old];
        const oldIndex = items.findIndex(i => i.id === itemId);
        const [moved] = items.splice(oldIndex, 1);
        items.splice(newIndex, 0, moved);
        return items;
      });

      return { previous };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(['items'], context.previous);
    },
  });
}
```

## Example 3: Optimistic Delete with Undo

```javascript
function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) =>
      fetch(`/api/items/${itemId}`, { method: 'DELETE' }),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });
      const previous = queryClient.getQueryData(['items']);

      // Remove optimistically
      queryClient.setQueryData(['items'], (old) =>
        old.filter(item => item.id !== itemId)
      );

      // Show undo toast
      const undoId = toast.info('Item deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            queryClient.setQueryData(['items'], previous);
            // Cancel the delete request if still pending
          },
        },
        duration: 5000,
      });

      return { previous, undoId };
    },

    onError: (err, itemId, context) => {
      queryClient.setQueryData(['items'], context.previous);
      toast.dismiss(context.undoId);
      toast.error('Failed to delete');
    },
  });
}
```

## Example 4: SWR Optimistic Update

```javascript
import useSWR, { useSWRConfig } from 'swr';

function TodoList() {
  const { data: todos, mutate } = useSWR('/api/todos', fetcher);

  const toggleTodo = async (id) => {
    // Optimistic update
    const optimisticData = todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );

    await mutate(
      async () => {
        await fetch(`/api/todos/${id}/toggle`, { method: 'POST' });
        return optimisticData;
      },
      {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );
  };

  return todos?.map(todo => (
    <TodoItem key={todo.id} todo={todo} onToggle={() => toggleTodo(todo.id)} />
  ));
}
```
