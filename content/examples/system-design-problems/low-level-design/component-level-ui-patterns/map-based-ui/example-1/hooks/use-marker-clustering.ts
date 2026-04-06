'use client';
import { useState, useCallback, useMemo, useRef } from 'react';
import type { Marker } from '../lib/map-types';

interface ClusterGroup {
  id: string;
  centerLat: number;
  centerLng: number;
  count: number;
  markers: Marker[];
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
}

interface UseMarkerClusteringOptions {
  markers: Marker[];
  zoom: number;
  gridSize?: number;
  minClusterZoom?: number;
}

interface UseMarkerClusteringReturn {
  clusters: ClusterGroup[];
  individualMarkers: Marker[];
  showClusters: boolean;
  getClusterMarkers: (clusterId: string) => Marker[];
  getMarkerClusterId: (markerId: string) => string | null;
}

/**
 * Grid-based marker clustering with zoom-dependent regrouping.
 * At lower zoom levels, nearby markers are grouped into clusters.
 * As the user zooms in, clusters dissolve into individual markers.
 */
export function useMarkerClustering({
  markers,
  zoom,
  gridSize = 60,
  minClusterZoom = 12,
}: UseMarkerClusteringOptions): UseMarkerClusteringReturn {
  const markersRef = useRef(markers);
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  const showClusters = zoom < minClusterZoom;

  /**
   * Compute grid-based clusters.
   * The grid cell size scales with zoom level: higher zoom = smaller cells = fewer markers per cluster.
   */
  const clusters = useMemo(() => {
    if (!showClusters) return [];

    // Grid cell size in degrees, inversely proportional to zoom
    const cellSize = 360 / Math.pow(2, zoom) * (gridSize / 256);

    // Assign each marker to a grid cell
    const grid: Map<string, Marker[]> = new Map();

    for (const marker of markers) {
      const cellX = Math.floor(marker.lng / cellSize);
      const cellY = Math.floor(marker.lat / cellSize);
      const cellKey = `${cellX},${cellY}`;

      const cell = grid.get(cellKey) ?? [];
      cell.push(marker);
      grid.set(cellKey, cell);
    }

    // Convert grid cells to cluster groups
    const result: ClusterGroup[] = [];
    for (const [key, clusterMarkers] of grid.entries()) {
      if (clusterMarkers.length <= 1) continue;

      const centerLat = clusterMarkers.reduce((sum, m) => sum + m.lat, 0) / clusterMarkers.length;
      const centerLng = clusterMarkers.reduce((sum, m) => sum + m.lng, 0) / clusterMarkers.length;
      const minLat = Math.min(...clusterMarkers.map((m) => m.lat));
      const maxLat = Math.max(...clusterMarkers.map((m) => m.lat));
      const minLng = Math.min(...clusterMarkers.map((m) => m.lng));
      const maxLng = Math.max(...clusterMarkers.map((m) => m.lng));

      result.push({
        id: `cluster-${key}`,
        centerLat,
        centerLng,
        count: clusterMarkers.length,
        markers: clusterMarkers,
        bounds: { minLat, maxLat, minLng, maxLng },
      });
    }

    return result;
  }, [markers, zoom, gridSize, minClusterZoom, showClusters]);

  /**
   * Markers that are not part of any cluster (standalone).
   */
  const individualMarkers = useMemo(() => {
    if (!showClusters) return markers;
    const clusteredIds = new Set(clusters.flatMap((c) => c.markers.map((m) => m.id)));
    return markers.filter((m) => !clusteredIds.has(m.id));
  }, [markers, clusters, showClusters]);

  // Build a lookup map for marker -> cluster
  const markerToClusterRef = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    const map = new Map<string, string>();
    for (const cluster of clusters) {
      for (const marker of cluster.markers) {
        map.set(marker.id, cluster.id);
      }
    }
    markerToClusterRef.current = map;
  }, [clusters]);

  const getClusterMarkers = useCallback(
    (clusterId: string) => {
      return clusters.find((c) => c.id === clusterId)?.markers ?? [];
    },
    [clusters]
  );

  const getMarkerClusterId = useCallback((markerId: string): string | null => {
    return markerToClusterRef.current.get(markerId) ?? null;
  }, []);

  return {
    clusters,
    individualMarkers,
    showClusters,
    getClusterMarkers,
    getMarkerClusterId,
  };
}
