/**
 * Ripple effect utility.
 *
 * Creates a ripple DOM node at the click position inside the container element.
 * Uses CSS custom properties for positioning and CSS @keyframes for the
 * scale + opacity animation. Returns a cleanup function to remove the ripple
 * if the component unmounts before the animation completes.
 *
 * The ripple element self-removes after 600ms as a safety net.
 */

const MAX_RIPPLES_PER_CONTAINER = 5;

let rippleStyleInjected = false;

function ensureRippleStyle() {
  if (rippleStyleInjected || typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.setAttribute('data-button-ripple', 'true');
  style.textContent = `
    @keyframes ripple-expand {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 0.35;
      }
      100% {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
      }
    }
    .button-ripple {
      position: absolute;
      border-radius: 9999px;
      background: currentColor;
      pointer-events: none;
      opacity: 0;
      animation: ripple-expand 600ms ease-out forwards;
    }
  `;
  document.head.appendChild(style);
  rippleStyleInjected = true;
}

export interface RippleHandle {
  /** Call this to forcibly remove the ripple (e.g., on unmount). */
  cleanup: () => void;
}

export function createRipple(
  container: HTMLElement,
  event: React.MouseEvent<HTMLElement>
): RippleHandle | null {
  if (typeof document === 'undefined') return null;

  ensureRippleStyle();

  const rect = container.getBoundingClientRect();
  const existingRipples = container.querySelectorAll('.button-ripple');

  // Cap concurrent ripples to prevent DOM accumulation
  if (existingRipples.length >= MAX_RIPPLES_PER_CONTAINER) {
    // Remove the oldest ripple
    existingRipples[0].remove();
  }

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.className = 'button-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = `${rect.width}px`;
  ripple.style.height = `${rect.width}px`; // square for uniform scale

  container.appendChild(ripple);

  let cleanedUp = false;

  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    if (ripple.parentNode) {
      ripple.remove();
    }
  };

  // Self-remove after animation completes (safety net)
  ripple.addEventListener('animationend', cleanup, { once: true });

  return { cleanup };
}
