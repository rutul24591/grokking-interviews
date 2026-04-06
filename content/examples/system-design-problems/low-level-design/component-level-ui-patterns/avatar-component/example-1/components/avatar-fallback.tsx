import { useMemo } from 'react';
import { generateInitials } from '../lib/initials-generator';
import { AVATAR_SIZE_PX, type AvatarSize, type AvatarShape } from '../lib/avatar-types';

interface AvatarFallbackProps {
  name?: string;
  size: AvatarSize;
  shape: AvatarShape;
  onRetry?: () => void;
}

// Accessible color palette: background + text color pairs
const COLOR_PALETTE: { bg: string; text: string }[] = [
  { bg: 'bg-violet-500', text: 'text-white' },
  { bg: 'bg-blue-500', text: 'text-white' },
  { bg: 'bg-emerald-500', text: 'text-white' },
  { bg: 'bg-rose-500', text: 'text-white' },
  { bg: 'bg-amber-500', text: 'text-gray-900' },
  { bg: 'bg-cyan-500', text: 'text-white' },
  { bg: 'bg-pink-500', text: 'text-white' },
  { bg: 'bg-indigo-500', text: 'text-white' },
  { bg: 'bg-teal-500', text: 'text-white' },
  { bg: 'bg-orange-500', text: 'text-white' },
  { bg: 'bg-fuchsia-500', text: 'text-white' },
  { bg: 'bg-lime-500', text: 'text-gray-900' },
  { bg: 'bg-sky-500', text: 'text-white' },
  { bg: 'bg-red-500', text: 'text-white' },
  { bg: 'bg-green-500', text: 'text-white' },
  { bg: 'bg-purple-500', text: 'text-white' },
  { bg: 'bg-yellow-500', text: 'text-gray-900' },
  { bg: 'bg-blue-600', text: 'text-white' },
  { bg: 'bg-red-600', text: 'text-white' },
  { bg: 'bg-green-600', text: 'text-white' },
];

/**
 * Simple DJB2 hash function.
 * Returns a non-negative integer.
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * AvatarFallback renders either initials or a generic user icon SVG.
 *
 * - If name is provided and yields initials, render initials in a colored container.
 * - If no name, render a generic user silhouette SVG.
 * - Supports retry on hover when onRetry is provided.
 */
export default function AvatarFallback({
  name,
  size,
  shape,
  onRetry,
}: AvatarFallbackProps) {
  const initials = generateInitials(name);
  const px = AVATAR_SIZE_PX[size];

  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'rounded-square' ? 'rounded-lg' : '';

  // Derive color from name hash (memoized for performance)
  const colorPair = useMemo(() => {
    if (!name) return COLOR_PALETTE[0];
    const hash = djb2Hash(name.trim().toLowerCase());
    return COLOR_PALETTE[hash % COLOR_PALETTE.length];
  }, [name]);

  const fontSize = size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg';

  // If no name available, render generic user icon
  if (!initials) {
    return (
      <div
        className={`${shapeClass} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        style={{ width: px, height: px }}
        role="img"
        aria-label="Anonymous user"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-3/5 h-3/5 text-gray-400 dark:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path
            d="M4 20c0-4 4-7 8-7s8 3 8 7"
            fill="currentColor"
          />
        </svg>
      </div>
    );
  }

  // Render initials
  return (
    <div
      className={`${shapeClass} ${colorPair.bg} ${colorPair.text} ${fontSize} flex items-center justify-center font-semibold select-none`}
      style={{ width: px, height: px }}
      onMouseEnter={onRetry}
      title="Retry loading image"
    >
      {initials}
    </div>
  );
}
