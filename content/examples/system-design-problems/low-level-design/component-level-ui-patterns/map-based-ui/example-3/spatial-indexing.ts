/**
 * Map-based UI — Staff-Level Performance Optimization.
 *
 * Staff differentiator: WebGL-based marker rendering for 10K+ markers,
 * tile caching with Service Worker, and spatial indexing (quadtree)
 * for fast marker search within viewport.
 */

/**
 * Quadtree spatial index for fast marker lookup within a viewport.
 * Reduces search from O(n) to O(log n).
 */
export class MarkerQuadtree {
  private bounds: { minX: number; minY: number; maxX: number; maxY: number };
  private markers: Array<{ id: string; x: number; y: number }> = [];
  private children: MarkerQuadtree[] | null = null;
  private readonly MAX_MARKERS = 10;
  private readonly MAX_DEPTH = 6;
  private depth: number;

  constructor(
    bounds: { minX: number; minY: number; maxX: number; maxY: number },
    depth: number = 0,
  ) {
    this.bounds = bounds;
    this.depth = depth;
  }

  /**
   * Inserts a marker into the quadtree.
   */
  insert(marker: { id: string; x: number; y: number }): void {
    // Out of bounds
    if (
      marker.x < this.bounds.minX ||
      marker.x > this.bounds.maxX ||
      marker.y < this.bounds.minY ||
      marker.y > this.bounds.maxY
    ) {
      return;
    }

    // If leaf node and capacity not reached, add here
    if (!this.children) {
      this.markers.push(marker);

      // Subdivide if capacity exceeded and not at max depth
      if (this.markers.length > this.MAX_MARKERS && this.depth < this.MAX_DEPTH) {
        this.subdivide();
      }
      return;
    }

    // Insert into appropriate child
    for (const child of this.children) {
      child.insert(marker);
    }
  }

  /**
   * Queries markers within a rectangular viewport.
   */
  query(bounds: { minX: number; minY: number; maxX: number; maxY: number }): Array<{ id: string; x: number; y: number }> {
    const results: Array<{ id: string; x: number; y: number }> = [];

    // No overlap
    if (
      bounds.maxX < this.bounds.minX ||
      bounds.minX > this.bounds.maxX ||
      bounds.maxY < this.bounds.minY ||
      bounds.minY > this.bounds.maxY
    ) {
      return results;
    }

    // Check markers at this node
    for (const marker of this.markers) {
      if (
        marker.x >= bounds.minX &&
        marker.x <= bounds.maxX &&
        marker.y >= bounds.minY &&
        marker.y <= bounds.maxY
      ) {
        results.push(marker);
      }
    }

    // Check children
    if (this.children) {
      for (const child of this.children) {
        results.push(...child.query(bounds));
      }
    }

    return results;
  }

  /**
   * Subdivides this node into four quadrants.
   */
  private subdivide(): void {
    const midX = (this.bounds.minX + this.bounds.maxX) / 2;
    const midY = (this.bounds.minY + this.bounds.maxY) / 2;

    this.children = [
      new MarkerQuadtree({ minX: this.bounds.minX, minY: this.bounds.minY, maxX: midX, maxY: midY }, this.depth + 1),
      new MarkerQuadtree({ minX: midX, minY: this.bounds.minY, maxX: this.bounds.maxX, maxY: midY }, this.depth + 1),
      new MarkerQuadtree({ minX: this.bounds.minX, minY: midY, maxX: midX, maxY: this.bounds.maxY }, this.depth + 1),
      new MarkerQuadtree({ minX: midX, minY: midY, maxX: this.bounds.maxX, maxY: this.bounds.maxY }, this.depth + 1),
    ];

    // Re-insert existing markers into children
    for (const marker of this.markers) {
      for (const child of this.children) {
        child.insert(marker);
      }
    }
    this.markers = [];
  }
}
