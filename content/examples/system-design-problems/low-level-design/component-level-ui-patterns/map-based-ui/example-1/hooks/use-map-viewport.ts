'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

interface Viewport {
  centerLat: number;
  centerLng: number;
  zoom: number;
  bounds: { north: number; south: number; east: number; west: number } | null;
}

interface UseMapViewportOptions {
  initialLat: number;
  initialLng: number;
  initialZoom: number;
  minZoom?: number;
  maxZoom?: number;
  onChange?: (viewport: Viewport) => void;
}

function calculateBounds(
  centerLat: number,
  centerLng: number,
  zoom: number
): { north: number; south: number; east: number; west: number } {
  // Simplified bounds calculation: ~360 / 2^zoom degrees visible
  const degreesVisible = 360 / Math.pow(2, zoom);
  const halfLat = degreesVisible * 0.5 * 0.56; // latitude compression
  const halfLng = degreesVisible * 0.5;
  return {
    north: Math.min(85.051129, centerLat + halfLat),
    south: Math.max(-85.051129, centerLat - halfLat),
    east: ((centerLng + halfLng + 180) % 360) - 180,
    west: ((centerLng - halfLng + 180) % 360) - 180,
  };
}

export function useMapViewport({
  initialLat,
  initialLng,
  initialZoom,
  minZoom = 1,
  maxZoom = 20,
  onChange,
}: UseMapViewportOptions) {
  const [viewport, setViewport] = useState<Viewport>({
    centerLat: initialLat,
    centerLng: initialLng,
    zoom: initialZoom,
    bounds: calculateBounds(initialLat, initialLng, initialZoom),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const setViewportSafe = useCallback(
    (next: Viewport) => {
      setViewport(next);
      onChange?.(next);
    },
    [onChange]
  );

  const panBy = useCallback(
    (deltaX: number, deltaY: number) => {
      setViewportSafe((prev) => {
        const pixelsPerDegree = 256 * Math.pow(2, prev.zoom) / 360;
        const dLng = deltaX / pixelsPerDegree;
        const dLat = -deltaY / pixelsPerDegree;
        const next = {
          ...prev,
          centerLat: prev.centerLat + dLat,
          centerLng: prev.centerLng + dLng,
          bounds: calculateBounds(prev.centerLat + dLat, prev.centerLng + dLng, prev.zoom),
        };
        return next;
      });
    },
    [setViewportSafe]
  );

  const zoomTo = useCallback(
    (zoom: number) => {
      const clamped = Math.max(minZoom, Math.min(maxZoom, zoom));
      setViewportSafe((prev) => ({
        ...prev,
        zoom: clamped,
        bounds: calculateBounds(prev.centerLat, prev.centerLng, clamped),
      }));
    },
    [minZoom, maxZoom, setViewportSafe]
  );

  const flyTo = useCallback(
    (lat: number, lng: number, zoom?: number) => {
      const z = zoom ?? viewport.zoom;
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, z));
      setViewportSafe({
        centerLat: lat,
        centerLng: lng,
        zoom: clampedZoom,
        bounds: calculateBounds(lat, lng, clampedZoom),
      });
    },
    [viewport.zoom, minZoom, maxZoom, setViewportSafe]
  );

  const fitBounds = useCallback(
    (north: number, south: number, east: number, west: number, padding = 0) => {
      const centerLat = (north + south) / 2;
      const centerLng = ((east + west) / 2 + 180) % 360 - 180;

      // Calculate zoom to fit bounds
      const latDiff = north - south;
      const lngDiff = ((east - west + 360) % 360);
      const maxDiff = Math.max(latDiff / 0.56, lngDiff);
      const zoom = Math.floor(Math.log2(360 / maxDiff));
      const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));

      setViewportSafe({
        centerLat,
        centerLng,
        zoom: clampedZoom,
        bounds: { north, south, east, west },
      });
    },
    [minZoom, maxZoom, setViewportSafe]
  );

  // Mouse/touch pan handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerDown = (e: PointerEvent) => {
      isPanningRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPanningRef.current || !lastPosRef.current) return;
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      panBy(-dx, -dy);
    };

    const onPointerUp = () => {
      isPanningRef.current = false;
      lastPosRef.current = null;
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
    };
  }, [panBy]);

  // Scroll zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;
      zoomTo(viewport.zoom + delta);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [viewport.zoom, zoomTo]);

  return {
    viewport,
    containerRef,
    panBy,
    zoomTo,
    flyTo,
    fitBounds,
  };
}
