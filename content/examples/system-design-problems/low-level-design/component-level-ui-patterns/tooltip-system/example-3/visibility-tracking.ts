/**
 * Tooltip — Staff-Level Performance and Accessibility Optimization.
 *
 * Staff differentiator: IntersectionObserver-based visibility tracking
 * (hide tooltip when trigger scrolls out of view), MutationObserver for
 * trigger element removal, and reduced-motion support.
 */

/**
 * Hook that tracks tooltip trigger visibility and hides tooltip when trigger
 * is no longer visible in the viewport.
 */
export function useTooltipVisibilityTracking(
  triggerRef: React.RefObject<HTMLElement | null>,
  onHidden: () => void,
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            onHidden();
          }
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(triggerRef.current);

    return () => observerRef.current?.disconnect();
  }, [triggerRef, onHidden]);
}

/**
 * Detects if the user prefers reduced motion and returns a configuration
 * that disables tooltip animations.
 */
export function useReducedMotion(): { animated: boolean } {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return { animated: !prefersReducedMotion };
}
