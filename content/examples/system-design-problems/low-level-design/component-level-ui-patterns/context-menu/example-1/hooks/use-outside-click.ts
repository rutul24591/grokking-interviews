import { useEffect } from 'react';
import { useContextMenuStore } from '../lib/context-menu-store';

/**
 * Hook that detects clicks outside the referenced menu element
 * and closes the context menu when detected.
 */
export function useOutsideClick(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const element = ref.current;
      if (!element) return;

      // Check if the click target is inside the menu
      if (element.contains(e.target as Node)) {
        return;
      }

      // Also check if the click is inside any open sub-menu
      const subMenus = document.querySelectorAll('[data-context-submenu="true"]');
      for (const menu of subMenus) {
        if (menu.contains(e.target as Node)) {
          return;
        }
      }

      // Click was outside — close the menu
      useContextMenuStore.getState().closeMenu();
    }

    // Use mousedown to detect outside clicks before the click event fires
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
