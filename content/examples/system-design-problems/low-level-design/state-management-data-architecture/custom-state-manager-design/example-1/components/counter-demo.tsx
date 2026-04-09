'use client';
import { createStore, Store } from '../lib/store-core';
import { useMyStore } from '../hooks/useMyStore';

// Define store type
interface CounterState {
  count: number;
  step: number;
}

// Create store instance
const counterStore = createStore<CounterState>({
  count: 0,
  step: 1,
});

/**
 * CounterDemo shows a simple counter using the custom state manager.
 * Two components subscribe to different slices — they re-render independently.
 */
export function CounterDemo() {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Custom Store Counter</h3>
      <div className="flex gap-4">
        <CounterDisplay />
        <StepControl />
      </div>
    </div>
  );
}

/**
 * CounterDisplay subscribes only to the count slice.
 * Re-renders when count changes, not when step changes.
 */
function CounterDisplay() {
  const count = useMyStore(counterStore, (state) => state.count);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => counterStore.setState({ count: count - 1 })}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        aria-label="Decrement"
      >
        -
      </button>
      <span className="text-2xl font-bold w-12 text-center">{count}</span>
      <button
        onClick={() => counterStore.setState({ count: count + 1 })}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        aria-label="Increment"
      >
        +
      </button>
    </div>
  );
}

/**
 * StepControl subscribes only to the step slice.
 * Re-renders when step changes, not when count changes.
 */
function StepControl() {
  const step = useMyStore(counterStore, (state) => state.step);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="step-input" className="text-sm">Step:</label>
      <input
        id="step-input"
        type="number"
        value={step}
        onChange={(e) =>
          counterStore.setState({ step: Math.max(1, parseInt(e.target.value) || 1) })
        }
        className="w-16 px-2 py-1 border rounded"
        min="1"
      />
    </div>
  );
}
