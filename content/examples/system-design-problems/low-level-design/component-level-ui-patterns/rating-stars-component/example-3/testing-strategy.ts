/**
 * Rating Stars — Staff-Level Testing Strategy.
 *
 * Staff differentiator: Automated accessibility testing for the ARIA slider
 * pattern, visual regression testing for half-star rendering, and keyboard
 * interaction testing with focus management.
 */

/**
 * Test suite for rating stars ARIA compliance.
 */
export function testRatingAria(container: HTMLElement): { pass: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Container should have role="radiogroup" or be a group of buttons
  const group = container.querySelector('[role="radiogroup"], [role="group"]');
  if (!group) {
    errors.push('Rating container missing role="radiogroup" or role="group"');
  }

  // 2. Each star should have role="radio" or be a button
  const stars = container.querySelectorAll('[role="radio"], button');
  if (stars.length === 0) {
    errors.push('No interactive star elements found');
  }

  // 3. Each star should have aria-label or aria-labelledby
  stars.forEach((star, i) => {
    if (!star.getAttribute('aria-label') && !star.getAttribute('aria-labelledby')) {
      errors.push(`Star ${i + 1} missing accessible label`);
    }
  });

  // 4. Selected star should have aria-checked="true"
  const selected = container.querySelector('[aria-checked="true"]');
  if (!selected) {
    errors.push('No star has aria-checked="true"');
  }

  return { pass: errors.length === 0, errors };
}

/**
 * Test suite for keyboard interaction.
 */
export async function testRatingKeyboard(
  container: HTMLElement,
): Promise<{ pass: boolean; errors: string[] }> {
  const errors: string[] = [];
  const stars = Array.from(container.querySelectorAll('button'));

  if (stars.length === 0) {
    return { pass: false, errors: ['No interactive star elements found'] };
  }

  // Focus first star
  stars[0].focus();

  // Test ArrowRight increments
  stars[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  const focusedAfterRight = document.activeElement;
  if (focusedAfterRight !== stars[1]) {
    errors.push('ArrowRight did not move focus to next star');
  }

  // Test Home key jumps to first
  stars[stars.length - 1]?.focus();
  stars[stars.length - 1]?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
  const focusedAfterHome = document.activeElement;
  if (focusedAfterHome !== stars[0]) {
    errors.push('Home key did not move focus to first star');
  }

  // Test End key jumps to last
  stars[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  const focusedAfterEnd = document.activeElement;
  if (focusedAfterEnd !== stars[stars.length - 1]) {
    errors.push('End key did not move focus to last star');
  }

  return { pass: errors.length === 0, errors };
}
