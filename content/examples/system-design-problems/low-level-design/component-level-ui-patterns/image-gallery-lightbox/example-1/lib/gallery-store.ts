import { create } from 'zustand';
import type { GalleryImage, LightboxState, ZoomState, PanBounds } from './gallery-types';
import { DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from './gallery-types';

interface GalleryState extends Omit<LightboxState, 'zoom'> {
  zoom: ZoomState;
  panBounds: PanBounds | null;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  setZoom: (zoom: Partial<ZoomState>) => void;
  resetZoom: () => void;
  setShowCaption: (show: boolean) => void;
  setPanBounds: (bounds: PanBounds | null) => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  isOpen: false,
  currentIndex: 0,
  images: [],
  zoom: { ...DEFAULT_ZOOM },
  showCaption: true,
  panBounds: null,

  openLightbox: (index) => {
    const { images } = get();
    const clampedIndex = Math.max(0, Math.min(index, images.length - 1));
    set({
      isOpen: true,
      currentIndex: clampedIndex,
      zoom: { ...DEFAULT_ZOOM },
      showCaption: true,
    });
  },

  closeLightbox: () => {
    set({
      isOpen: false,
      zoom: { ...DEFAULT_ZOOM },
    });
  },

  next: () => {
    const { currentIndex, images } = get();
    const nextIndex = Math.min(currentIndex + 1, images.length - 1);
    set({
      currentIndex: nextIndex,
      zoom: { ...DEFAULT_ZOOM },
    });
  },

  prev: () => {
    const { currentIndex } = get();
    const prevIndex = Math.max(0, currentIndex - 1);
    set({
      currentIndex: prevIndex,
      zoom: { ...DEFAULT_ZOOM },
    });
  },

  goTo: (index) => {
    const { images } = get();
    const clampedIndex = Math.max(0, Math.min(index, images.length - 1));
    set({
      currentIndex: clampedIndex,
      zoom: { ...DEFAULT_ZOOM },
    });
  },

  setZoom: (partialZoom) => {
    set((state) => {
      const newScale = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, partialZoom.scale ?? state.zoom.scale)
      );
      return {
        zoom: {
          scale: newScale,
          translateX: partialZoom.translateX ?? state.zoom.translateX,
          translateY: partialZoom.translateY ?? state.zoom.translateY,
        },
      };
    });
  },

  resetZoom: () => {
    set({ zoom: { ...DEFAULT_ZOOM } });
  },

  setShowCaption: (show) => {
    set({ showCaption: show });
  },

  setPanBounds: (bounds) => {
    set({ panBounds: bounds });
  },
}));

/**
 * Initialize the gallery with images.
 * Call this once when the gallery component mounts.
 */
export const initGallery = (images: GalleryImage[]) => {
  useGalleryStore.setState({ images });
};

/**
 * Convenience API for imperative lightbox control.
 *
 * Usage:
 *   import { gallery } from './gallery-store';
 *   gallery.open(5);
 *   gallery.close();
 */
export const gallery = {
  open: (index: number) => useGalleryStore.getState().openLightbox(index),
  close: () => useGalleryStore.getState().closeLightbox(),
  next: () => useGalleryStore.getState().next(),
  prev: () => useGalleryStore.getState().prev(),
  goTo: (index: number) => useGalleryStore.getState().goTo(index),
  zoomIn: () => {
    const { zoom } = useGalleryStore.getState();
    useGalleryStore.getState().setZoom({ scale: zoom.scale + 0.5 });
  },
  zoomOut: () => {
    const { zoom } = useGalleryStore.getState();
    useGalleryStore.getState().setZoom({ scale: zoom.scale - 0.5 });
  },
};
