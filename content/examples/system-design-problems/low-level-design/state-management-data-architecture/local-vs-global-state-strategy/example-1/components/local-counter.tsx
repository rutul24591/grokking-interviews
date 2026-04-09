'use client';
import { useState, useCallback } from 'react';

/**
 * LocalCounter demonstrates local state management with useState.
 * This is the simplest form of state - owned and consumed by a single component.
 * No other component needs access to the count value.
 */
export function LocalCounter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Local Counter (useState)</h3>
      <div className="text-3xl font-bold mb-4 text-center">{count}</div>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          aria-label="Decrement"
        >
          -{step}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          aria-label="Reset"
        >
          Reset
        </button>
        <button
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          aria-label="Increment"
        >
          +{step}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="step" className="text-sm">Step:</label>
        <input
          id="step"
          type="number"
          value={step}
          onChange={(e) => setStep(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 px-2 py-1 border rounded"
          min="1"
        />
      </div>
    </div>
  );
}
