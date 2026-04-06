/**
 * Kanban Board — Staff-Level Testing Strategy.
 *
 * Staff differentiator: End-to-end drag-and-drop testing with Playwright,
 * visual regression testing for card rendering, and WebSocket mock for
 * real-time collaboration testing.
 */

/**
 * E2E test helper for drag-and-drop interactions using Playwright.
 */
export class KanbanDragDropTester {
  /**
   * Simulates dragging a card from one column to another.
   * Uses pointer events for realistic drag simulation.
   */
  async dragCard(
    page: any, // Playwright Page
    sourceColumnSelector: string,
    targetColumnSelector: string,
    cardIndex: number = 0,
  ): Promise<void> {
    const card = page.locator(`${sourceColumnSelector} [data-card-index="${cardIndex}"]`);
    const target = page.locator(targetColumnSelector);

    // Get card position
    const cardBox = await card.boundingBox();
    const targetBox = await target.boundingBox();

    if (!cardBox || !targetBox) throw new Error('Element not found');

    // Start drag from card center
    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
    await page.mouse.down();

    // Drag to target center
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });

    // Release
    await page.mouse.up();
  }

  /**
   * Tests keyboard drag flow.
   */
  async testKeyboardDrag(page: any, cardSelector: string): Promise<void> {
    await page.locator(cardSelector).focus();
    await page.keyboard.press('Space'); // Pick up
    await page.keyboard.press('ArrowDown'); // Move down
    await page.keyboard.press('Enter'); // Drop

    // Verify drop completed
    const ariaGrabbed = await page.locator(cardSelector).getAttribute('aria-grabbed');
    if (ariaGrabbed !== 'false') {
      throw new Error('Card was not dropped (aria-grabbed is not false)');
    }
  }
}

/**
 * WebSocket mock for testing real-time card movements.
 */
export function createWebSocketMock(): {
  mock: { send: jest.Mock; close: jest.Mock; onmessage: Function | null };
  simulateRemoteMove: (data: any) => void;
} {
  const mock = {
    send: jest.fn(),
    close: jest.fn(),
    onmessage: null as Function | null,
  };

  const simulateRemoteMove = (data: any) => {
    if (mock.onmessage) {
      mock.onmessage({ data: JSON.stringify(data) });
    }
  };

  return { mock, simulateRemoteMove };
}
