/**
 * Map Marker Clustering — Grid-based clustering with zoom-dependent cell size.
 *
 * Interview edge case: 1000 markers on a map. Rendering all 1000 at zoom level 2
 * causes performance issues. Solution: grid-based clustering with cell size that
 * scales with zoom level. At zoom 2, cell size is 200px (large clusters).
 * At zoom 10, cell size is 20px (small clusters, more granular).
 */

export interface Marker { id: string; lat: number; lng: number; }
export interface Cluster { id: string; lat: number; lng: number; count: number; markers: Marker[]; }

/**
 * Calculates the grid cell size based on zoom level.
 * Higher zoom = smaller cells = more granular clustering.
 */
function getCellSizeForZoom(zoom: number): number {
  // At zoom 0: 200px cells, at zoom 15: ~10px cells
  return Math.max(10, 200 / Math.pow(2, zoom));
}

/**
 * Clusters markers using a grid-based algorithm.
 * Markers within the same grid cell are grouped into a cluster.
 */
export function clusterMarkers(markers: Marker[], zoom: number): Cluster[] {
  const cellSize = getCellSizeForZoom(zoom);
  const grid = new Map<string, Marker[]>();

  for (const marker of markers) {
    // Convert lat/lng to grid cell coordinates
    const cellX = Math.floor(marker.lng / cellSize);
    const cellY = Math.floor(marker.lat / cellSize);
    const cellKey = `${cellX},${cellY}`;

    if (!grid.has(cellKey)) grid.set(cellKey, []);
    grid.get(cellKey)!.push(marker);
  }

  const clusters: Cluster[] = [];
  let clusterIndex = 0;

  for (const [key, cellMarkers] of grid) {
    if (cellMarkers.length === 1) {
      // Single marker — no clustering needed
      clusters.push({
        id: `marker_${cellMarkers[0].id}`,
        lat: cellMarkers[0].lat,
        lng: cellMarkers[0].lng,
        count: 1,
        markers: cellMarkers,
      });
    } else {
      // Multiple markers — create cluster
      const avgLat = cellMarkers.reduce((sum, m) => sum + m.lat, 0) / cellMarkers.length;
      const avgLng = cellMarkers.reduce((sum, m) => sum + m.lng, 0) / cellMarkers.length;
      clusters.push({
        id: `cluster_${clusterIndex++}`,
        lat: avgLat,
        lng: avgLng,
        count: cellMarkers.length,
        markers: cellMarkers,
      });
    }
  }

  return clusters;
}
