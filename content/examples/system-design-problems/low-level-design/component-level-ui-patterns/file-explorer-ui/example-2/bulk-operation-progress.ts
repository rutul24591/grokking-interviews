/**
 * Bulk Operation Progress — Multi-file delete/move with progress tracking and abort.
 *
 * Interview edge case: User selects 100 files to delete. The operation takes time.
 * User should see progress (15/100 deleted), have an abort button, and be notified
 * of partial failures (e.g., 95 succeeded, 5 failed due to permission).
 */

export interface BulkOperationState {
  total: number;
  completed: number;
  failed: number;
  isAborted: boolean;
  errors: { itemId: string; error: string }[];
}

type ProgressCallback = (state: BulkOperationState) => void;
type AbortSignal = { aborted: boolean };

/**
 * Executes a bulk operation with progress tracking, abort support, and error collection.
 */
export async function executeBulkOperation<T>(
  items: T[],
  operationFn: (item: T, abortSignal: AbortSignal) => Promise<void>,
  onProgress?: ProgressCallback,
  batchSize: number = 10,
): Promise<BulkOperationState> {
  const state: BulkOperationState = {
    total: items.length,
    completed: 0,
    failed: 0,
    isAborted: false,
    errors: [],
  };

  const abortSignal: AbortSignal = { aborted: false };

  for (let i = 0; i < items.length; i += batchSize) {
    if (abortSignal.aborted) {
      state.isAborted = true;
      break;
    }

    const batch = items.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((item) => operationFn(item, abortSignal)),
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === 'fulfilled') {
        state.completed++;
      } else {
        state.failed++;
        state.errors.push({
          itemId: `item_${i + j}`,
          error: result.reason?.message || 'Unknown error',
        });
      }
    }

    onProgress?.({ ...state });
  }

  return state;
}
