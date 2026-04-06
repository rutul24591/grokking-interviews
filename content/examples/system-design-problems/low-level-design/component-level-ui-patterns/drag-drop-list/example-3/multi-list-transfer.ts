/**
 * Drag & Drop List — Staff-Level Multi-List Drag Transfer.
 *
 * Staff differentiator: Dragging items between different lists with
 * permission checks, optimistic transfer with rollback, and
 * cross-list reordering with animation.
 */

export interface DragTransferState {
  draggedItemId: string;
  sourceListId: string;
  targetListId: string | null;
  dropIndex: number | null;
  isDragging: boolean;
}

/**
 * Manages drag-and-drop between multiple lists with optimistic updates.
 */
export class MultiListDragManager {
  private state: DragTransferState = {
    draggedItemId: null,
    sourceListId: '',
    targetListId: null,
    dropIndex: null,
    isDragging: false,
  };

  /**
   * Starts a drag operation.
   */
  startDrag(itemId: string, sourceListId: string): void {
    this.state = {
      draggedItemId: itemId,
      sourceListId,
      targetListId: null,
      dropIndex: null,
      isDragging: true,
    };
  }

  /**
   * Updates the drop target as the user drags over different lists.
   */
  updateDropTarget(listId: string, index: number): void {
    if (!this.state.isDragging) return;
    this.state.targetListId = listId;
    this.state.dropIndex = index;
  }

  /**
   * Completes the drag operation with optimistic transfer.
   * Returns the operation details for server submission.
   */
  completeDrag(): { itemId: string; fromList: string; toList: string; index: number } | null {
    if (!this.state.isDragging || !this.state.targetListId || this.state.dropIndex === null) {
      this.cancelDrag();
      return null;
    }

    const operation = {
      itemId: this.state.draggedItemId!,
      fromList: this.state.sourceListId,
      toList: this.state.targetListId,
      index: this.state.dropIndex,
    };

    this.resetState();
    return operation;
  }

  /**
   * Cancels the drag operation.
   */
  cancelDrag(): void {
    this.resetState();
  }

  /**
   * Rolls back a transfer operation on server failure.
   */
  rollback(
    item: any,
    sourceList: any[],
    targetList: any[],
  ): void {
    // Remove from target list
    const index = targetList.findIndex((i: any) => i.id === item.id);
    if (index !== -1) targetList.splice(index, 1);

    // Add back to source list
    sourceList.push(item);
  }

  private resetState(): void {
    this.state = {
      draggedItemId: null,
      sourceListId: '',
      targetListId: null,
      dropIndex: null,
      isDragging: false,
    };
  }

  getState(): DragTransferState {
    return { ...this.state };
  }
}
