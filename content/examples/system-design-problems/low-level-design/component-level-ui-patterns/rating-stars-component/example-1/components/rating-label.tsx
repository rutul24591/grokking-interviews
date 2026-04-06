'use client';

interface RatingLabelProps {
  value: number;
  max: number;
  customLabel?: string;
  screenReaderOnly?: boolean;
}

export function RatingLabel({
  value,
  max,
  customLabel,
  screenReaderOnly = false,
}: RatingLabelProps) {
  const text = customLabel ?? `${value} out of ${max} star${max !== 1 ? 's' : ''}`;

  return (
    <span
      className={
        screenReaderOnly
          ? 'sr-only'
          : 'mt-2 text-sm text-gray-600 dark:text-gray-400'
      }
    >
      {text}
    </span>
  );
}
