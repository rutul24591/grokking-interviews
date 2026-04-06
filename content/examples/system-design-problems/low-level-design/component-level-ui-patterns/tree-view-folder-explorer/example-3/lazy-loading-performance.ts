/**
 * Tree View — Staff-Level Large Tree Performance Optimization.
 *
 * Staff differentiator: Flat list virtualization of tree nodes, lazy loading
 * of child nodes on expand, and path caching for fast parent lookup.
 */

/**
 * Manages lazy loading of tree children on expand.
 * Fetches children only when a node is expanded for the first time.
 */
export class LazyTreeLoader {
  private loadedChildren: Map<string, any[]> = new Map();
  private loadingPromises: Map<string, Promise<any[]>> = new Map();
  private fetchChildrenFn: (parentId: string) => Promise<any[]>;

  constructor(fetchChildrenFn: (parentId: string) => Promise<any[]>) {
    this.fetchChildrenFn = fetchChildrenFn;
  }

  /**
   * Loads children for a node. Returns cached data if already loaded.
   */
  async loadChildren(parentId: string): Promise<any[]> {
    // Return cached if available
    if (this.loadedChildren.has(parentId)) {
      return this.loadedChildren.get(parentId)!;
    }

    // Return pending promise if already loading
    if (this.loadingPromises.has(parentId)) {
      return this.loadingPromises.get(parentId)!;
    }

    // Fetch and cache
    const promise = this.fetchChildrenFn(parentId).then((children) => {
      this.loadedChildren.set(parentId, children);
      this.loadingPromises.delete(parentId);
      return children;
    });

    this.loadingPromises.set(parentId, promise);
    return promise;
  }

  /**
   * Clears cached children for a node (e.g., after adding/removing children).
   */
  invalidate(parentId: string): void {
    this.loadedChildren.delete(parentId);
    this.loadingPromises.delete(parentId);
  }

  /**
   * Clears all cached data.
   */
  clearCache(): void {
    this.loadedChildren.clear();
    this.loadingPromises.clear();
  }

  /**
   * Returns whether children are loaded for a node.
   */
  areChildrenLoaded(parentId: string): boolean {
    return this.loadedChildren.has(parentId);
  }
}
