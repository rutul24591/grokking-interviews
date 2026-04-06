// ============================================================
// mention-engine.ts — @mention detection, autocomplete dropdown
// positioning, filtering, and insertion into the document model.
// ============================================================

import type { MentionData, MentionState } from "./editor-types";

const MENTION_TRIGGER = "@";
const MIN_QUERY_LENGTH = 1;
const MAX_RESULTS = 8;

// ── Detect Mention Trigger ──────────────────────────────────

/**
 * Scans the text before the cursor position for an @mention pattern.
 * Returns the query string (characters after @) and the start/end
 * offsets of the @mention text within the textContent.
 *
 * Example: "Hello @joh|" returns { query: "joh", start: 6, end: 10 }
 * where | represents the cursor position.
 */
export function detectMentionQuery(
  textBeforeCursor: string
): { query: string; start: number; end: number } | null {
  const lastIndex = textBeforeCursor.lastIndexOf(MENTION_TRIGGER);
  if (lastIndex === -1) return null;

  // Check that there is no space between the @ and the cursor
  const segment = textBeforeCursor.slice(lastIndex);
  if (segment.includes(" ")) return null;

  const query = segment.slice(1); // strip the @

  // Don't trigger for empty queries unless it's just the @
  if (query.length < MIN_QUERY_LENGTH && query.length > 0) return null;

  return {
    query,
    start: lastIndex,
    end: textBeforeCursor.length,
  };
}

// ── Filter Mentionable Users ────────────────────────────────

/**
 * Filters the mentionable users list by matching the query against
 * usernames and display names. Returns up to MAX_RESULTS matches.
 */
export function filterMentionUsers(
  query: string,
  users: MentionData[]
): MentionData[] {
  if (!query) return users.slice(0, MAX_RESULTS);

  const lowerQuery = query.toLowerCase();

  return users
    .filter(
      (user) =>
        user.username.toLowerCase().includes(lowerQuery) ||
        user.displayName.toLowerCase().includes(lowerQuery)
    )
    .slice(0, MAX_RESULTS);
}

// ── Compute Dropdown Position ───────────────────────────────

/**
 * Computes the bounding rectangle for the mention dropdown based
 * on the cursor position in the contentEditable element.
 *
 * Returns { top, left } in pixels relative to the viewport.
 * If the position cannot be computed (e.g., no selection), returns null.
 */
export function computeDropdownPosition(
  editorEl: HTMLElement
): { top: number; left: number } | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const rects = range.getClientRects();
  if (rects.length === 0) return null;

  // Use the last rect (cursor position)
  const rect = rects[rects.length - 1];

  const editorRect = editorEl.getBoundingClientRect();
  if (!editorRect) return null;

  // Position dropdown below the cursor, aligned to the left
  let top = rect.bottom - editorRect.top + editorEl.scrollTop + 4;
  let left = rect.left - editorRect.left + editorEl.scrollLeft;

  // Constrain to editor bounds
  const dropdownWidth = 280;
  const dropdownHeight = 240;

  if (left + dropdownWidth > editorRect.width) {
    left = editorRect.width - dropdownWidth - 8;
  }
  if (left < 0) left = 8;

  if (top + dropdownHeight > editorRect.height) {
    // Flip above the cursor
    top = rect.top - editorRect.top + editorEl.scrollTop - dropdownHeight - 4;
  }
  if (top < 0) top = 8;

  return { top, left };
}

// ── Update Mention State ────────────────────────────────────

/**
 * Given the current text before the cursor and the list of
 * mentionable users, returns the updated MentionState.
 */
export function updateMentionState(
  textBeforeCursor: string,
  users: MentionData[],
  editorEl: HTMLElement,
  previousState: MentionState
): MentionState {
  const detection = detectMentionQuery(textBeforeCursor);

  if (!detection) {
    // No active mention query — close the dropdown
    return {
      query: "",
      results: [],
      selectedIndex: 0,
      position: null,
      isOpen: false,
    };
  }

  const { query } = detection;
  const results = filterMentionUsers(query, users);
  const position = computeDropdownPosition(editorEl);

  if (results.length === 0 || !position) {
    return {
      query,
      results: [],
      selectedIndex: 0,
      position: null,
      isOpen: false,
    };
  }

  // Preserve selected index if it's still valid
  const selectedIndex = Math.min(
    previousState.selectedIndex,
    results.length - 1
  );

  return {
    query,
    results,
    selectedIndex,
    position,
    isOpen: true,
  };
}

// ── Keyboard Navigation ─────────────────────────────────────

export function handleMentionKeyDown(
  state: MentionState,
  key: string
): MentionState {
  if (!state.isOpen) return state;

  switch (key) {
    case "ArrowDown":
      return {
        ...state,
        selectedIndex: Math.min(state.selectedIndex + 1, state.results.length - 1),
      };
    case "ArrowUp":
      return {
        ...state,
        selectedIndex: Math.max(state.selectedIndex - 1, 0),
      };
    case "Escape":
      return {
        ...state,
        isOpen: false,
        position: null,
      };
    default:
      return state;
  }
}

// ── Insert Mention ──────────────────────────────────────────

/**
 * Returns the text to insert and the replacement range for a
 * mention insertion. The @query text should be replaced with the
 * mention node.
 */
export function prepareMentionInsertion(
  user: MentionData,
  mentionStart: number,
  mentionEnd: number
): {
  displayText: string;
  mentionText: string;
  userId: string;
  userName: string;
} {
  return {
    displayText: `@${user.displayName}`,
    mentionText: `${MENTION_TRIGGER}${user.displayName}`,
    userId: user.id,
    userName: user.displayName,
  };
}
