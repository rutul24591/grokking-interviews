'use client';
import { useState, useCallback, useMemo } from 'react';
import type { Step } from './lib/stepper-types';

export function Stepper({ steps }: { steps: Step[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const progress = useMemo(() => Math.round((completedIds.size / steps.length) * 100), [completedIds.size, steps.length]);

  const advance = useCallback(() => {
    setCompletedIds((prev) => new Set(prev).add(steps[currentIdx].id));
    setCurrentIdx((i) => Math.min(steps.length - 1, i + 1));
  }, [currentIdx, steps]);

  const goBack = useCallback(() => {
    setCurrentIdx((i) => Math.max(0, i - 1));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
      </div>

      {/* Step indicators */}
      <nav aria-label="Progress" className="flex items-center justify-between mb-8">
        {steps.map((step, i) => {
          const isCompleted = completedIds.has(step.id);
          const isCurrent = i === currentIdx;
          return (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`} aria-current={isCurrent ? 'step' : undefined}>
                {isCompleted ? '✓' : i + 1}
              </div>
              <span className="ml-2 text-xs hidden sm:inline">{step.title}</span>
              {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />}
            </div>
          );
        })}
      </nav>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={goBack} disabled={currentIdx === 0} className="px-4 py-2 text-sm disabled:opacity-50">Back</button>
        <button onClick={advance} className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">{currentIdx === steps.length - 1 ? 'Submit' : 'Next'}</button>
      </div>
    </div>
  );
}
