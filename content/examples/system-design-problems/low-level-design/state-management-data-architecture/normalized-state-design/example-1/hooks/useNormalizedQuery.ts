import { useMemo } from 'react';

/**
 * Hook for memoized denormalization of normalized state.
 * Follows ID references to reconstruct nested structures.
 * Recalculates only when input entities change.
 *
 * @example
 * const postWithComments = useNormalizedQuery(
 *   [post, comments, users],
 *   ([p, commentsList, usersTable]) => ({
 *     ...p,
 *     author: usersTable[p.authorId],
 *     comments: commentsList.map(c => ({
 *       ...c,
 *       author: usersTable[c.authorId],
 *     })),
 *   })
 * );
 */
export function useNormalizedQuery<T>(
  inputs: any[],
  denormalize: (inputs: any[]) => T,
): T {
  return useMemo(() => denormalize(inputs), inputs);
}
