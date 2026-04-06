import type { ReactNode } from 'react';

export interface GalleryImage {
  id: string;
  src: string; // Full-resolution URL
  thumbnailSrc: string; // Thumbnail URL for gallery grid
  fullSrc: string; // Full-resolution URL for lightbox zoom
  blurhash?: string; // Blurhash placeholder string
  width: number;
  height: number;
  aspectRatio: number; // width / height
  title: string;
  description?: string;
  photographer?: string;
  dateTaken?: string;
  camera?: string;
  tags?: string[];
}

export interface ZoomState {
  scale: number; // 1 to MAX_ZOOM (default 5)
  translateX: number;
  translateY: number;
}

export interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
  images: GalleryImage[];
  zoom: ZoomState;
  showCaption: boolean;
}

export const DEFAULT_ZOOM: ZoomState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
};

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;
export const ZOOM_STEP = 0.5;

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  deltaX: number;
  deltaY: number;
  velocity: number; // px/ms
  duration: number; // ms
}

export type SwipeHandler = (event: SwipeEvent) => void;

export interface SwipeOptions {
  threshold?: number; // minimum distance in px (default: 50)
  velocityThreshold?: number; // minimum velocity in px/ms (default: 0.3)
  onSwipeLeft?: SwipeHandler;
  onSwipeRight?: SwipeHandler;
  onSwipeUp?: SwipeHandler;
  onSwipeDown?: SwipeHandler;
}

export interface PanBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
