"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-context-menu",
  title: "Design a Context Menu / Right-click Menu",
  description:
    "Complete LLD solution for an accessible context menu with viewport boundary detection, keyboard navigation, sub-menus, focus trapping, portal rendering, and ARIA compliance.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "context-menu",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "context-menu",
    "accessibility",
    "keyboard-navigation",
    "portal",
    "focus-management",
    "viewport-detection",
  ],
  relatedTopics: [
    "modal-component",
    "toast-notification-system",
    "dropdown-select",
    "tree-view",
  ],
};

export default function ContextMenuArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable context menu component for a large-scale React
          application. The menu appears when the user triggers it via right-click on a
          target element, long-press on touch devices, or keyboard shortcuts (Menu key,
          Shift+F10). The menu must position itself near the trigger point, detect viewport
          boundaries to prevent overflow, support nested sub-menus with fly-out behavior,
          and be fully accessible via keyboard navigation. It must render in a React Portal
          to escape <code>overflow: hidden</code> parents, trap focus while open, and
          restore focus to the trigger element on close. The system must support menu items
          with labels, icons, keyboard shortcut hints, separators, disabled states with
          explanatory tooltips, and sub-menu indicators.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with concurrent mode support.
          </li>
          <li>
            Context menus can be triggered on any element in the application (table rows,
            file items, text selections, custom controls).
          </li>
          <li>
            Menu items are statically defined per trigger or dynamically fetched based on
            the context (e.g., selected items in a list).
          </li>
          <li>
            Sub-menus can be nested up to 3 levels deep.
          </li>
          <li>
            The application supports light and dark mode.
          </li>
          <li>
            The menu must close on outside click, Escape key, or when a new context menu
            opens.
          </li>
          <li>
            Maximum menu width is constrained (e.g., 280px) to prevent overly wide menus
            on large screens.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Trigger Detection:</strong> Menu opens on <code>contextmenu</code>
            event (right-click), long-press (500ms on touch devices), and keyboard
            triggers (Menu key, Shift+F10).
          </li>
          <li>
            <strong>Positioning:</strong> Menu appears near the cursor or trigger element.
            Viewport boundary detection prevents overflow — the menu flips to the opposite
            side if it would extend beyond the viewport edges.
          </li>
          <li>
            <strong>Menu Items:</strong> Each item supports a label, optional icon,
            optional keyboard shortcut hint (e.g., <code>Ctrl+C</code>), separator/divider
            between groups, and sub-menu indicator arrow.
          </li>
          <li>
            <strong>Disabled Items:</strong> Items can be disabled (grayed out,
            non-interactive) with a tooltip explaining why the action is unavailable.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> ArrowUp/ArrowDown moves focus between
            items, Enter/Space activates the focused item, Escape closes the menu,
            Home/End jump to first/last item.
          </li>
          <li>
            <strong>Focus Trap:</strong> While the menu is open, focus cycles within the
            menu. On close, focus returns to the element that triggered the menu.
          </li>
          <li>
            <strong>Sub-menus:</strong> Hovering or pressing ArrowRight on a sub-menu item
            opens a fly-out sub-menu. ArrowLeft closes the current sub-menu and returns
            focus to the parent item.
          </li>
          <li>
            <strong>Portal Rendering:</strong> Menu renders in a React Portal to escape
            <code>overflow: hidden</code> and <code>position: relative</code> constraints
            of ancestor elements.
          </li>
          <li>
            <strong>Animation:</strong> Fade-in with scale-up on open, fade-out on close.
            Sub-menus slide in from the appropriate side.
          </li>
          <li>
            <strong>Outside Click:</strong> Clicking outside the menu closes it and all
            open sub-menus.
          </li>
          <li>
            <strong>Accessibility:</strong> Menu uses <code>role=&quot;menu&quot;</code>,
            items use <code>role=&quot;menuitem&quot;</code>, sub-menu triggers use
            <code>aria-haspopup=&quot;menu&quot;</code> with
            <code>aria-expanded</code> and <code>aria-controls</code>.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Menu open/close should not cause layout jank.
            Animations must use GPU-composited properties (opacity, transform).
          </li>
          <li>
            <strong>Memory:</strong> All event listeners, timers, and portals must be
            cleaned up on unmount. No memory leaks from long-press timers or outside-click
            handlers.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for menu item definitions,
            state, position calculations, and sub-menu stacks.
          </li>
          <li>
            <strong>Reusability:</strong> The component must be composable — any element
            can be wrapped with the context menu trigger.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Right-click near the bottom-right corner of the viewport — menu must flip to
            avoid clipping.
          </li>
          <li>
            Long-press on touch device triggers native context menu — must be prevented
            with <code>preventDefault()</code> and CSS <code>touch-action</code>.
          </li>
          <li>
            Trigger element is removed from DOM while menu is open — focus restoration must
            handle a null reference gracefully.
          </li>
          <li>
            Multiple context menus — only one should be open at a time. Opening a new one
            closes the previous.
          </li>
          <li>
            Menu content changes while menu is open (e.g., items become disabled/enabled
            due to state changes) — the menu should reflect the latest state without
            requiring re-open.
          </li>
          <li>
            Sub-menu fly-out near the right edge of the viewport — sub-menu must appear on
            the left side of the parent item instead.
          </li>
          <li>
            SSR rendering — the portal must not render during SSR. Menu state is inherently
            client-side.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>trigger detection</strong>,{" "}
          <strong>state management</strong>, and <strong>rendering</strong> into
          composable layers. A trigger component captures the <code>contextmenu</code>,
          long-press, and keyboard events, calculates the initial position, and updates a
          Zustand store. The store holds the open/close state, position, menu items,
          focused item index, and sub-menu stack. A portal-rendered menu component
          subscribes to the store, renders items with animations, handles keyboard
          navigation, and manages focus trapping. Sub-menus are managed by a dedicated
          module that handles fly-out positioning, nested stacks, and ArrowRight/ArrowLeft
          navigation.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Local state per trigger component:</strong> Each trigger manages its
            own menu state via <code>useState</code>. This works for simple cases but breaks
            when multiple triggers exist — there is no coordination to ensure only one menu
            is open. A global store is necessary for singleton behavior.
          </li>
          <li>
            <strong>Event-based pub/sub:</strong> An event emitter could open/close menus
            without a store. However, React&apos;s rendering model benefits from reactive
            state — Zustand provides subscriptions that automatically trigger re-renders
            when state changes, whereas pub/sub requires manual synchronization.
          </li>
          <li>
            <strong>CSS-only context menu:</strong> Using <code>:active</code> and
            <code>:focus-within</code> pseudo-classes to show/hide menus avoids JavaScript
            entirely. This approach cannot handle keyboard navigation, focus trapping,
            viewport boundary detection, or sub-menu fly-outs with flip logic.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + Portal is optimal:</strong> Zustand provides a singleton
          store accessible from any component without provider wrapping. The portal rendering
          strategy ensures the menu escapes CSS constraints of ancestor elements. This pattern
          is used by production libraries like Floating UI and Radix UI&apos;s context menu.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of eight modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Menu Types &amp; Interfaces (<code>context-menu-types.ts</code>)</h4>
          <p>
            Defines the <code>MenuItem</code> interface with fields for <code>id</code>,
            <code>label</code>, optional <code>icon</code>, optional <code>shortcut</code>
            hint string, optional <code>disabled</code> flag with <code>disabledReason</code>,
            optional <code>subMenu</code> (array of child MenuItems), and an optional
            <code>onSelect</code> callback. The <code>ContextMenuState</code> interface
            tracks <code>isOpen</code>, <code>position</code> (&lbrace; x, y &rbrace;),
            <code>items</code>, <code>focusedIndex</code>, <code>triggerRef</code>, and
            <code>subMenuStack</code>. The <code>MenuPosition</code> type represents the
            computed x/y coordinates with flip direction flags.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Menu Store (<code>context-menu-store.ts</code>)</h4>
          <p>
            Manages the global context menu state via Zustand. Exposes actions for
            <code>openMenu</code> (sets items, position, resets focused index),
            <code>closeMenu</code> (clears state, returns focus to trigger),
            <code>setFocusedIndex</code>, <code>pushSubMenu</code>, and
            <code>popSubMenu</code>. The store also tracks whether a menu is currently open
            to prevent multiple simultaneous menus.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Position Calculator (<code>menu-position-calculator.ts</code>)</h4>
          <p>
            Pure utility function that computes the optimal menu position given cursor
            coordinates, menu dimensions, and viewport dimensions. It checks all four edges
            (top, bottom, left, right) and flips the position if the menu would overflow.
            A configurable margin (default: 8px) ensures the menu does not touch the
            cursor directly. Returns <code>&lbrace; x, y, flipX, flipY &rbrace;</code>.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Sub-menu Manager (<code>submenu-manager.ts</code>)</h4>
          <p>
            Handles opening and closing sub-menus on hover and ArrowRight navigation.
            Maintains a stack of open sub-menus with their positions. ArrowLeft closes the
            current sub-menu and returns focus to the parent item. Sub-menu position is
            computed relative to the parent item with viewport boundary detection.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Keyboard Handler (<code>menu-keyboard-handler.ts</code>)</h4>
          <p>
            Processes keyboard events within the menu. ArrowUp/ArrowDown move focus between
            non-disabled items (skipping separators). Enter/Space triggers the focused
            item&apos;s <code>onSelect</code>. Escape closes the entire menu and all
            sub-menus. Home/End jump to the first/last non-disabled item. ArrowRight opens
            sub-menus, ArrowLeft closes them.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Trigger Hook (<code>use-context-menu.ts</code>)</h4>
          <p>
            React hook that attaches <code>contextmenu</code> event listeners, manages a
            long-press timer for touch devices (500ms threshold), and captures keyboard
            triggers (Menu key, Shift+F10). On trigger, it calls the position calculator,
            updates the store, and returns a ref to attach to any element.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Outside Click Hook (<code>use-outside-click.ts</code>)</h4>
          <p>
            Detects clicks outside the menu element using a <code>mousedown</code> listener
            on <code>document</code>. When detected, it calls <code>closeMenu</code> on the
            store. Uses a ref to identify the menu element and ignores clicks within it.
            Cleans up the listener on unmount.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">8. Component Layer</h4>
          <p>
            <strong>ContextMenuTrigger</strong> — wrapper component that uses the
            <code>useContextMenu</code> hook and renders children with the attached ref.
            <strong>ContextMenu</strong> — portal-rendered menu container with focus trap,
            entrance/exit animations, and keyboard event delegation.
            <strong>ContextMenuItem</strong> — individual menu item with icon, label,
            shortcut hint, disabled state, sub-menu indicator arrow.
            <strong>ContextMenuSeparator</strong> — horizontal divider between item groups.
            <strong>ContextMenuSubmenu</strong> — fly-out sub-menu portal with nested items
            and independent focus management.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store is the single source of truth. When a trigger fires,
          <code>openMenu</code> is called with the computed position and item array. The
          store sets <code>isOpen = true</code>, stores the position, items, and a reference
          to the trigger element for focus restoration. The <code>focusedIndex</code> starts
          at 0 (first non-disabled item). Sub-menus are tracked via a stack — each entry
          contains the sub-menu items and the parent item index. When <code>closeMenu</code>
          is called, the stack is cleared, focus is restored, and <code>isOpen</code> is set
          to <code>false</code>.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/context-menu-architecture.svg"
          alt="Context menu architecture showing trigger detection, position calculation, and portal rendering"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User right-clicks on a trigger element.
          </li>
          <li>
            <code>contextmenu</code> event fires, <code>useContextMenu</code> hook prevents
            default, captures clientX/clientY.
          </li>
          <li>
            Hook calls <code>calculatePosition(x, y)</code>, gets adjusted coordinates with
            flip flags.
          </li>
          <li>
            Hook calls <code>store.openMenu(items, position, triggerRef)</code>.
          </li>
          <li>
            Zustand notifies subscribers. ContextMenu component renders via Portal.
          </li>
          <li>
            ContextMenu traps focus, focuses first item, runs entrance animation.
          </li>
          <li>
            User navigates with ArrowDown — <code>menuKeyboardHandler</code> updates
            focusedIndex in store.
          </li>
          <li>
            User presses ArrowRight on a sub-menu item — <code>submenuManager</code> opens
            fly-out sub-menu, pushes to stack.
          </li>
          <li>
            User clicks outside — <code>useOutsideClick</code> detects, calls
            <code>closeMenu</code>.
          </li>
          <li>
            Exit animation plays, focus returns to trigger element, store clears.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution follows a unidirectional flow: trigger events update the store,
          store subscriptions drive rendering, and user interactions within the menu
          dispatch back to the store. The position calculator and keyboard handler are pure
          functions that take inputs and return outputs — they have no side effects and are
          independently testable.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Position Calculation Flow</h3>
        <p>
          Given cursor position <code>(cursorX, cursorY)</code>, the calculator checks if
          <code>cursorX + menuWidth + margin</code> exceeds <code>viewportWidth</code>. If
          so, it sets <code>flipX = true</code> and positions the menu at
          <code>cursorX - menuWidth - margin</code>. Similarly for the Y axis: if
          <code>cursorY + menuHeight + margin</code> exceeds <code>viewportHeight</code>,
          it sets <code>flipY = true</code> and positions at
          <code>cursorY - menuHeight - margin</code>. This ensures the menu is always fully
          visible regardless of cursor position.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Sub-menu Stack Flow</h3>
        <p>
          When ArrowRight is pressed on a sub-menu item, the <code>submenuManager</code>
          creates a new sub-menu entry with the child items, computes the fly-out position
          (right side of parent item, or left if near viewport edge), and pushes it to the
          stack. The stack depth is limited to 3 to prevent infinite nesting. When ArrowLeft
          is pressed, the top entry is popped and focus returns to the parent item index.
          When the main menu closes, the entire stack is cleared.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Focus Trap Flow</h3>
        <p>
          When the menu opens, <code>document.activeElement</code> is saved as the
          previously focused element. A <code>keydown</code> listener intercepts the Tab
          key — if the user tabs past the last focusable item, focus wraps to the first.
          This creates a closed focus loop. On close, the saved element is focused if it
          still exists in the DOM. If the trigger element was removed, focus falls back to
          <code>document.body</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Corner triggers:</strong> When the cursor is near a corner, both X and
            Y flip flags may be set. The calculator handles this independently — the menu
            appears in the quadrant with the most available space.
          </li>
          <li>
            <strong>Dynamic item changes:</strong> If menu items change while the menu is
            open (e.g., an action becomes available), the store updates the items array.
            The focused index is clamped to the new array length to prevent out-of-bounds
            access.
          </li>
          <li>
            <strong>SSR safety:</strong> The ContextMenu component uses the SSR-safe
            mounting pattern (state + useEffect) to render the portal only on the client.
            During SSR, it returns null.
          </li>
          <li>
            <strong>Touch long-press:</strong> The long-press timer (500ms) starts on
            <code>touchstart</code> and is cleared on <code>touchend</code> or
            <code>touchmove</code>. If the timer fires, it synthesizes a context menu event
            at the touch position and prevents the native context menu via
            <code>preventDefault()</code>.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 13 files: TypeScript
            interfaces, Zustand store, position calculator, sub-menu manager, keyboard
            handler, two custom hooks, five UI components, and a full EXPLANATION.md
            walkthrough. Click the <strong>Example</strong> toggle at the top of the article
            to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Types &amp; Interfaces (context-menu-types.ts)</h3>
        <p>
          Defines the <code>MenuItem</code> interface as a discriminated union — items can
          be <code>item</code>, <code>separator</code>, or <code>submenu</code>. The
          <code>ContextMenuState</code> interface tracks all runtime state including the
          sub-menu stack. The <code>MenuPosition</code> type carries computed coordinates
          with flip direction flags for the position calculator.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (context-menu-store.ts)</h3>
        <p>
          The store manages open/close state, position, items, focused index, and sub-menu
          stack. <code>openMenu</code> resets all state and stores the trigger ref for focus
          restoration. <code>closeMenu</code> clears the sub-menu stack, restores focus, and
          resets state. <code>setFocusedIndex</code> updates the focused item (used by
          keyboard handler and hover events). <code>pushSubMenu</code> and{" "}
          <code>popSubMenu</code> manage the sub-menu stack with depth limiting.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Position Calculator (menu-position-calculator.ts)</h3>
        <p>
          Pure function that takes cursor coordinates, estimated menu dimensions, and
          viewport dimensions. Returns adjusted coordinates with flip flags. The algorithm
          checks each axis independently — X flip positions the menu to the left of the
          cursor instead of right, Y flip positions it above instead of below. A margin
          constant (8px) ensures spacing from the cursor.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Sub-menu Manager (submenu-manager.ts)</h3>
        <p>
          Manages fly-out sub-menu lifecycle. On ArrowRight or hover, computes the sub-menu
          position relative to the parent item (right side by default, left if near viewport
          edge). Pushes the sub-menu to the store&apos;s stack with the parent index for
          focus restoration. On ArrowLeft, pops the stack and focuses the parent. Depth is
          limited to 3 levels.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Keyboard Handler (menu-keyboard-handler.ts)</h3>
        <p>
          Processes keyboard events within the menu context. ArrowUp/ArrowDown find the next
          non-disabled, non-separator item and update the focused index. Enter/Space call
          the focused item&apos;s <code>onSelect</code>. Escape closes the entire menu.
          Home/End find the first/last valid item. ArrowRight opens sub-menus, ArrowLeft
          closes them. All operations skip disabled items and separators in focus order.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Trigger Hook (use-context-menu.ts)</h3>
        <p>
          Hook that returns a ref to attach to any element. On mount, it attaches a
          <code>contextmenu</code> listener that prevents default, calculates position, and
          opens the menu. For touch devices, it starts a 500ms timer on
          <code>touchstart</code> — if the timer fires before <code>touchend</code>, it
          opens the menu at the touch position and prevents the native menu. For keyboard,
          it listens for the Menu key (code: <code>ContextMenu</code>) and Shift+F10.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Outside Click Hook (use-outside-click.ts)</h3>
        <p>
          Hook that takes a ref to the menu element. On mount, it attaches a
          <code>mousedown</code> listener to <code>document</code>. On each click, it
          checks if the clicked target is inside the menu ref using
          <code>contains()</code>. If not, it calls <code>closeMenu</code>. Listener is
          removed on unmount.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Component Layer</h3>
        <p>
          <strong>ContextMenuTrigger</strong> wraps children and attaches the ref from
          <code>useContextMenu</code>. <strong>ContextMenu</strong> renders via Portal with
          SSR-safe mounting, focus trap, entrance/exit animations (opacity + scale), and
          delegates keyboard events to the handler. <strong>ContextMenuItem</strong> renders
          icon, label, shortcut hint, disabled state with title tooltip, and sub-menu arrow.
          <strong>ContextMenuSeparator</strong> renders a horizontal divider.{" "}
          <strong>ContextMenuSubmenu</strong> is a secondary portal-rendered menu for nested
          items with independent position calculation.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Position calculation</td>
                <td className="p-2">O(1) — constant arithmetic</td>
                <td className="p-2">O(1) — returns position object</td>
              </tr>
              <tr>
                <td className="p-2">openMenu / closeMenu</td>
                <td className="p-2">O(1) — state assignment</td>
                <td className="p-2">O(m) — m menu items stored</td>
              </tr>
              <tr>
                <td className="p-2">Keyboard navigation</td>
                <td className="p-2">O(n) — scan items for next valid</td>
                <td className="p-2">O(1) — index update</td>
              </tr>
                <tr>
                <td className="p-2">Sub-menu push/pop</td>
                <td className="p-2">O(1) — stack push/pop</td>
                <td className="p-2">O(d) — d levels deep (max 3)</td>
              </tr>
              <tr>
                <td className="p-2">Outside click detection</td>
                <td className="p-2">O(1) — contains check</td>
                <td className="p-2">O(1) — single ref comparison</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the number of menu items (typically 5-15) and{" "}
          <code>d</code> is the sub-menu depth (max 3). All operations are effectively
          constant-time in practice.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Keyboard navigation scanning:</strong> ArrowDown scans forward through
            items to find the next non-disabled, non-separator item. With 50+ items this
            could be O(n). Mitigation: maintain a separate index of focusable item positions
            in the store, updated when items change.
          </li>
          <li>
            <strong>Portal re-renders:</strong> If the store subscriber selects the entire
            state object, every state change re-renders the entire menu. Mitigation: use
            Zustand selectors to subscribe to individual fields (e.g., only
            <code>focusedIndex</code>), so only the affected item re-renders.
          </li>
          <li>
            <strong>Animation jank:</strong> Animating layout properties triggers expensive
            recalculations. Mitigation: animate only <code>opacity</code> and{" "}
            <code>transform</code> (scale, translate), which are GPU-composited.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Selector-based subscriptions:</strong> Each ContextMenuItem subscribes
            to its own index match with <code>focusedIndex</code>. Moving focus only
            re-renders the previously focused and newly focused items.
          </li>
          <li>
            <strong>Lazy sub-menu rendering:</strong> Sub-menus are not rendered in the DOM
            until they are opened. This keeps the initial menu lightweight.
          </li>
          <li>
            <strong>requestAnimationFrame for animations:</strong> Entrance animation is
            scheduled via <code>requestAnimationFrame</code> to ensure it runs after the
            browser paint, avoiding frame drops.
          </li>
          <li>
            <strong>Debounce position calculation:</strong> If the trigger position changes
            rapidly (e.g., user drags while holding right-click), debounce the position
            calculation to avoid thrashing.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Menu item labels may contain user-generated content (e.g., file names, user
          names). These must be rendered as text content, not HTML, to prevent XSS. React
          automatically escapes string content, but if custom React nodes are allowed as
          item content, they must come from trusted sources. Shortcut hint strings should
          also be sanitized if derived from user input.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              ArrowUp/ArrowDown move focus between menu items, skipping disabled items and
              separators.
            </li>
            <li>
              Enter and Space activate the focused item, triggering its{" "}
              <code>onSelect</code> callback.
            </li>
            <li>
              Escape closes the menu and all sub-menus, returning focus to the trigger.
            </li>
            <li>
              Home jumps to the first non-disabled item, End jumps to the last.
            </li>
            <li>
              ArrowRight opens a sub-menu (if the focused item has one), ArrowLeft closes
              the current sub-menu.
            </li>
            <li>
              Tab key is trapped — focus cycles within the menu rather than escaping to the
              page.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <ul className="space-y-2">
            <li>
              The menu container uses <code>role=&quot;menu&quot;</code> with{" "}
              <code>aria-labelledby</code> pointing to the trigger element.
            </li>
            <li>
              Each item uses <code>role=&quot;menuitem&quot;</code> with{" "}
              <code>tabIndex=&quot;-1&quot;</code> (managed focus, not tab-order).
            </li>
            <li>
              Sub-menu triggers use <code>aria-haspopup=&quot;menu&quot;</code>,{" "}
              <code>aria-expanded=&quot;true&quot;</code> when open, and{" "}
              <code>aria-controls</code> pointing to the sub-menu element ID.
            </li>
            <li>
              Disabled items use <code>aria-disabled=&quot;true&quot;</code> with a
              <code>title</code> attribute for the tooltip explanation.
            </li>
            <li>
              Separators use <code>role=&quot;separator&quot;</code> with
              <code>aria-orientation=&quot;horizontal&quot;</code>.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Focus Management</h3>
        <p>
          Proper focus management is critical for accessibility. When the menu opens, focus
          is programmatically moved to the first menu item (not the container). This ensures
          screen reader users immediately hear the menu content. When the menu closes, focus
          returns to the trigger element. If the trigger element no longer exists in the DOM
          (e.g., it was removed during the menu&apos;s open state), focus falls back to
          <code>document.body</code> to prevent focus loss.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Single-menu constraint:</strong> Only one context menu can be open at a
            time. Opening a new menu automatically closes the previous one. This prevents
            menu stacking abuse from programmatic triggers.
          </li>
          <li>
            <strong>Sub-menu depth limit:</strong> Sub-menu nesting is capped at 3 levels
            to prevent excessively deep navigation trees that are confusing for keyboard and
            screen reader users.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Position calculator:</strong> Test all flip scenarios — cursor at
            top-left (no flip), bottom-right (flip both), top-right (flip X), bottom-left
            (flip Y). Verify margin is correctly applied.
          </li>
          <li>
            <strong>Keyboard handler:</strong> Test ArrowDown skips disabled items and
            separators, ArrowUp wraps to the last item from the first, Enter calls
            <code>onSelect</code>, Escape returns the correct action, Home/End jump
            correctly.
          </li>
          <li>
            <strong>Store actions:</strong> Test openMenu sets all fields correctly,
            closeMenu clears everything and calls focus restoration, pushSubMenu adds to
            stack, popSubMenu removes and returns parent index.
          </li>
          <li>
            <strong>Sub-menu manager:</strong> Test ArrowRight opens sub-menu with correct
            position, ArrowLeft closes it and returns focus, depth limit prevents nesting
            beyond 3.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full open/close lifecycle:</strong> Render ContextMenuTrigger with a
            button, fire contextmenu event at (100, 100), assert menu appears in DOM at
            correct position. Fire Escape key, assert menu is removed and button is focused.
          </li>
          <li>
            <strong>Keyboard navigation:</strong> Open menu, fire ArrowDown 3 times, assert
            focusedIndex is 3 (skipping any disabled items). Fire Enter, assert
            <code>onSelect</code> was called for that item.
          </li>
          <li>
            <strong>Sub-menu flow:</strong> Open menu, focus a sub-menu item, fire
            ArrowRight, assert sub-menu renders. Fire ArrowLeft, assert sub-menu is removed
            and focus returns to parent item.
          </li>
          <li>
            <strong>Outside click:</strong> Open menu, click on an element outside the
            menu, assert menu closes and focus returns to trigger.
          </li>
          <li>
            <strong>Long-press on touch:</strong> Fire touchstart on trigger, advance timers
            by 500ms, assert menu opens. Fire touchstart then touchend at 200ms, assert menu
            does not open.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify ContextMenu returns null during SSR and mounts correctly
            on hydration.
          </li>
          <li>
            Trigger element removed while menu is open: verify focus restoration falls back
            to <code>document.body</code> without errors.
          </li>
          <li>
            Menu with 50+ items: verify keyboard navigation performance remains acceptable,
            no memory leaks on repeated open/close.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered menu, verify role
            attributes, aria-disabled, aria-haspopup, and keyboard navigation.
          </li>
          <li>
            Viewport boundary: simulate small viewport (mobile), verify menu flips correctly
            and does not overflow.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Not preventing the default context menu:</strong> Candidates forget to
            call <code>event.preventDefault()</code> on the <code>contextmenu</code> event,
            so the browser&apos;s native right-click menu appears alongside the custom menu.
            This is a fundamental oversight.
          </li>
          <li>
            <strong>Hardcoded positioning without boundary detection:</strong> Placing the
            menu at <code>(clientX, clientY)</code> without checking viewport edges means
            the menu clips off-screen when triggered near edges. Interviewers expect
            candidates to discuss flip logic or at minimum clamping.
          </li>
          <li>
            <strong>No focus management:</strong> Opening a menu without moving focus into
            it means keyboard users cannot navigate. Closing without returning focus to the
            trigger leaves keyboard focus stranded. This is a critical accessibility failure.
          </li>
          <li>
            <strong>Animating layout properties:</strong> Animating <code>left</code>,{" "}
            <code>top</code>, or <code>width</code> triggers layout recalculations.
            Interviewers look for candidates who animate only <code>opacity</code> and{" "}
            <code>transform</code> for 60fps animations.
          </li>
          <li>
            <strong>Ignoring touch devices:</strong> Only handling <code>contextmenu</code>
            means the menu never appears on mobile. A long-press timer (or using the{" "}
            <code>contextmenu</code> event which some browsers fire on long-press) is
            necessary.
          </li>
          <li>
            <strong>Not using a portal:</strong> Rendering the menu inline means it can be
            clipped by <code>overflow: hidden</code> parents or obscured by z-index stacking
            contexts. Interviewers expect portal rendering for overlay components.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Portal vs Inline Rendering</h4>
          <p>
            Inline rendering keeps the menu within the React component tree, making context
            consumption straightforward. However, it is subject to ancestor CSS constraints
            (overflow: hidden, z-index). Portals escape these constraints but make context
            consumption trickier (though React 18+ handles this well). For context menus,
            portals are the correct choice because clipping by overflow-hidden parents is a
            common and frustrating bug. Libraries like Floating UI and Radix UI use portals
            for this reason.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Hover vs Click for Sub-menu Opening</h4>
          <p>
            Opening sub-menus on hover provides a fast, fluid experience for mouse users.
            However, it creates challenges for touch devices (no hover equivalent) and
            keyboard users (requires ArrowRight). The best approach supports both: hover
            opens after a short delay (150ms) to prevent accidental openings, ArrowRight
            opens for keyboard users, and tap toggles for touch. The delay prevents
            sub-menus from flashing as the mouse crosses over them en route to another target.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Cursor-based vs Anchor-based Positioning</h4>
          <p>
            Cursor-based positioning (menu appears at the mouse position) feels natural for
            right-click menus. However, for keyboard-triggered menus (Menu key, Shift+F10),
            there is no cursor position. The fallback is to position the menu at the trigger
            element&apos;s bounding rectangle (bottom-left corner). This dual-mode approach
            ensures the menu appears in a sensible location regardless of trigger method.
            The trade-off is implementing two positioning strategies and choosing the right
            one based on trigger type.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle menu items that require async data (e.g., &quot;Share
              with...&quot; fetching a contact list)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>lazy</code> flag to the MenuItem interface. When the menu
              renders a lazy item, it shows a loading state (spinner) and calls a
              <code>fetchItems</code> callback. On resolution, the item&apos;s sub-menu
              items are populated. This pattern is called &quot;lazy sub-menus&quot; and is
              used in VS Code and Chrome DevTools. The store tracks loading state per item
              to prevent duplicate fetches.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement keyboard shortcut hints that actually work (e.g.,
              pressing Ctrl+C triggers the &quot;Copy&quot; menu item)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>shortcut</code> field with a standardized format (e.g.,{" "}
              <code>&quot;Ctrl+C&quot;</code>). Register a global keydown listener that
              parses the shortcut string and matches it against the pressed keys. When a
              match is found, call the corresponding item&apos;s <code>onSelect</code>. This
              is separate from the menu&apos;s own keyboard navigation — shortcuts work even
              when the menu is closed. Use a library like Mousetrap or implement a simple
              key-matching utility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support virtualized menus for 100+ items?
            </p>
            <p className="mt-2 text-sm">
              A: Wrap the menu items container with a virtualization library like{" "}
              <code>@tanstack/react-virtual</code>. Calculate the total height based on
              item count and item height, then render only the items visible in the
              viewport (typically 10-15). Set a max-height on the menu container and
              <code>overflow-y: auto</code>. The focused index management remains the same —
              virtualization only affects rendering, not the logical focus order.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle multiple context menus on the same page (e.g., a table
              row context menu vs. a cell-level context menu)?
            </p>
            <p className="mt-2 text-sm">
              A: Use a singleton store with a <code>context</code> discriminator. Each
              trigger registers its menu type (e.g., <code>&quot;row&quot;</code> vs.{" "}
              <code>&quot;cell&quot;</code>). The store always holds only one open menu, so
              opening a cell menu closes the row menu. The item arrays are provided at
              trigger time, so different triggers supply different menus. Alternatively, use
              separate Zustand store instances keyed by context ID, but the singleton
              approach is simpler and sufficient.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle concurrent React (React 18+)?
            </p>
            <p className="mt-2 text-sm">
              A: The Zustand store is synchronous and external to React&apos;s rendering
              cycle, so it works correctly with concurrent features. The ContextMenu uses
              <code>useSyncExternalStore</code> (built into Zustand) for subscription
              synchronization. Portal rendering and focus management happen in effects,
              which are deferred until after the paint, ensuring they do not block urgent
              updates. Animations use CSS transitions running on the compositor thread.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add gesture support (e.g., swipe to open menu on mobile)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a touch gesture detector using <code>touchstart</code> and{" "}
              <code>touchmove</code>. A long-press (500ms without movement) opens the menu
              at the touch position. A swipe gesture (e.g., two-finger swipe) could also
              trigger the menu. Use a gesture library like @use-gesture/react or implement
              custom touch detection with distance and time thresholds. The key is
              distinguishing between a swipe, a scroll, and a tap — this requires tracking
              movement delta and elapsed time.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.radix-ui.com/primitives/docs/components/context-menu"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Radix UI Context Menu — Production-Grade Accessible Implementation
            </a>
          </li>
          <li>
            <a
              href="https://floating-ui.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Floating UI — Viewport Boundary Detection and Positioning Library
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/menu/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Menu Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Menu Button Pattern — Focus Management and Keyboard Navigation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/contextmenu_event"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Context Menu Event Documentation
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
