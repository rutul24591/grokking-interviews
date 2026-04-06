import type { ReactNode } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarShape = 'circle' | 'square' | 'rounded-square';

export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export const AVATAR_SIZE_PX: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export const AVATAR_SHAPE_CLASSES: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  'rounded-square': 'rounded-lg',
};

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: UserStatus;
  className?: string;
  onClick?: () => void;
  onError?: (src: string) => void;
  onLoaded?: (src: string) => void;
}

export interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
  overflowLabel?: string;
}

export interface ErrorEntry {
  errorCount: number;
  lastErrorAt: number;
  cacheStatus: 'pending' | 'loaded' | 'error' | 'retrying';
}

export const MAX_RETRIES = 3;

export const STATUS_COLORS: Record<UserStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-400',
  busy: 'bg-red-500',
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  online: 'online',
  offline: 'offline',
  away: 'away',
  busy: 'busy',
};

export const STATUS_TITLES: Record<UserStatus, string> = {
  online: 'Currently online',
  offline: 'Currently offline',
  away: 'Currently away',
  busy: 'Do not disturb',
};
