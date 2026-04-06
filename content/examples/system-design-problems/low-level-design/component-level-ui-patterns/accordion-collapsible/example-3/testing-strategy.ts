/**
 * Accordion — Staff-Level Testing Strategy.
 *
 * Staff differentiator: Automated accessibility testing for accordion
 * pattern, keyboard navigation verification, and animation timing tests.
 */

/**
 * Tests accordion ARIA compliance.
 */
export function testAccordionAria(container: HTMLElement): { pass: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check that headers are buttons
  const headers = container.querySelectorAll('[role="heading"] button, h2 button, h3 button');
  if (headers.length === 0) {
    errors.push('Accordion headers should be buttons inside heading elements');
  }

  // Check aria-expanded on each header button
  const buttons = container.querySelectorAll('button[aria-expanded]');
  if (buttons.length === 0) {
    errors.push('Accordion header buttons must have aria-expanded attribute');
  }

  // Check aria-controls linking headers to panels
  buttons.forEach((btn) => {
    const controlsId = btn.getAttribute('aria-controls');
    if (!controlsId) {
      errors.push(`Button "${btn.textContent}" missing aria-controls`);
    } else {
      const panel = document.getElementById(controlsId);
      if (!panel) {
        errors.push(`aria-controls "${controlsId}" does not match any element`);
      }
      if (panel.getAttribute('role') !== 'region') {
        errors.push(`Panel "${controlsId}" missing role="region"`);
      }
    }
  });

  return { pass: errors.length === 0, errors };
}

/**
 * Tests accordion keyboard navigation.
 */
export async function testAccordionKeyboard(container: HTMLElement): Promise<{ pass: boolean; errors: string[] }> {
  const errors: string[] = [];
  const buttons = Array.from(container.querySelectorAll('button[aria-expanded]'));

  if (buttons.length < 2) {
    return { pass: false, errors: ['Need at least 2 accordion items to test keyboard navigation'] };
  }

  // Focus first button
  buttons[0].focus();
  if (document.activeElement !== buttons[0]) {
    errors.push('First button could not be focused');
  }

  // Test ArrowDown moves to next button
  buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  if (document.activeElement !== buttons[1]) {
    errors.push('ArrowDown did not move focus to next header');
  }

  // Test ArrowUp moves to previous button
  buttons[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
  if (document.activeElement !== buttons[0]) {
    errors.push('ArrowUp did not move focus to previous header');
  }

  return { pass: errors.length === 0, errors };
}

/**
 * Tests exclusive mode — only one panel open at a time.
 */
export function testExclusiveMode(container: HTMLElement): { pass: boolean; errors: string[] } {
  const errors: string[] = [];
  const buttons = Array.from(container.querySelectorAll('button[aria-expanded]'));

  // Open first panel
  buttons[0]?.click();
  const expandedAfterFirst = buttons.filter((b) => b.getAttribute('aria-expanded') === 'true');

  if (expandedAfterFirst.length !== 1) {
    errors.push(`Expected 1 panel open, got ${expandedAfterFirst.length}`);
  }

  // Open second panel — first should close
  buttons[1]?.click();
  const expandedAfterSecond = buttons.filter((b) => b.getAttribute('aria-expanded') === 'true');

  if (expandedAfterSecond.length !== 1) {
    errors.push(`Expected 1 panel open after second click, got ${expandedAfterSecond.length}`);
  }

  if (expandedAfterSecond[0] !== buttons[1]) {
    errors.push('Second panel should be open, first should be closed');
  }

  return { pass: errors.length === 0, errors };
}
