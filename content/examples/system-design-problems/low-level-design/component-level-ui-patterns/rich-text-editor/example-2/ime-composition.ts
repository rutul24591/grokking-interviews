/**
 * IME Composition: CJK Input Handling During Rich Text Editing
 *
 * EDGE CASE: When users type Chinese, Japanese, or Korean (CJK) characters,
 * the IME (Input Method Editor) goes through a composition phase where
 * keystrokes build up a character candidate BEFORE it's committed. During
 * this phase, the browser fires input events for each intermediate keystroke,
 * but the actual committed character comes later via a compositionend event.
 *
 * If a rich text editor processes every input event naively, it will:
 * - Apply formatting to intermediate IME states (wrong)
 * - Trigger auto-complete/suggestions during composition (wrong)
 * - Fire onChange handlers with partial composition data (wrong)
 * - Break the IME flow by intercepting keystrokes it shouldn't touch
 *
 * SOLUTION: Gate all input processing behind composition state. During
 * compositionstart → compositionend, suspend normal input handling. Only
 * process the final committed text on compositionend.
 *
 * INTERVIEW FOLLOW-UP: "Why does typing Japanese break my editor?"
 * "How do you handle IME with custom key bindings?"
 */

import { useState, useRef, useCallback, useEffect } from "react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

interface CompositionState {
  /** Whether an IME composition is currently active */
  isComposing: boolean;
  /** The current composition text (intermediate candidate) */
  compositionText: string;
  /** The committed text from the last completed composition */
  lastCommittedText: string;
  /** Composition event data — includes the full composition string */
  compositionData: CompositionEvent | null;
}

interface UseIMECompositionOptions {
  /**
   * Callback fired ONLY when composition ends (character is committed).
   * Receives the final committed text.
   */
  onCommit?: (text: string) => void;
  /**
   * Callback fired on each composition update (intermediate candidate changes).
   * Useful for showing the candidate in a floating IME window.
   */
  onCompositionUpdate?: (text: string) => void;
  /**
   * Whether to suppress input events during composition.
   * When true, input events during composition are ignored.
   * Default: true (recommended for most editors).
   */
  suppressInputDuringComposition?: boolean;
}

interface UseIMECompositionReturn extends CompositionState {
  /** Whether a given input event should be processed (not during composition) */
  shouldProcessInput: (event: React.CompositionEvent | React.FormEvent) => boolean;
  /** Ref to attach to the contenteditable/input element */
  ref: React.RefObject<HTMLElement | null>;
  /** Reset composition state manually (e.g., on editor reset) */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// React Hook
// ---------------------------------------------------------------------------

/**
 * Hook that manages IME composition state for rich text editing.
 *
 * The composition lifecycle:
 *
 * 1. compositionstart — User begins IME input (e.g., types "k" for Japanese か)
 * 2. compositionupdate (×N) — Intermediate candidates update (か → が → 画)
 * 3. compositionend — User commits the final character (画)
 *
 * During steps 1-2, input events fire but should generally be IGNORED
 * by the editor. Only on compositionend should the committed text
 * be processed through the editor's change pipeline.
 *
 * Usage:
 *   const { ref, shouldProcessInput, isComposing } = useIMEComposition({
 *     onCommit: (text) => insertText(text),
 *   });
 *
 *   <div
 *     ref={ref}
 *     contentEditable
 *     onInput={(e) => shouldProcessInput(e) && handleInput(e)}
 *     onCompositionStart={handlers.onCompositionStart}
 *     onCompositionEnd={handlers.onCompositionEnd}
 *   />
 */
export function useIMEComposition(
  options: UseIMECompositionOptions = {}
): UseIMECompositionReturn {
  const {
    onCommit,
    onCompositionUpdate,
    suppressInputDuringComposition = true,
  } = options;

  const [compositionState, setCompositionState] = useState<CompositionState>({
    isComposing: false,
    compositionText: "",
    lastCommittedText: "",
    compositionData: null,
  });

  const elementRef = useRef<HTMLElement>(null);
  const compositionIdRef = useRef<number>(0);
  const pendingInputQueueRef = useRef<string[]>([]);

  /**
   * Determines whether an input event should be processed.
   * Returns false if we're in the middle of an IME composition and
   * suppressInputDuringComposition is enabled.
   */
  const shouldProcessInput = useCallback(
    (event: React.CompositionEvent | React.FormEvent): boolean => {
      if (!suppressInputDuringComposition) return true;

      // Check if the native event indicates active composition
      const nativeEvent = event.nativeEvent as InputEvent | CompositionEvent;
      if ("isComposing" in nativeEvent && nativeEvent.isComposing) {
        return false;
      }

      return !compositionState.isComposing;
    },
    [suppressInputDuringComposition, compositionState.isComposing]
  );

  /** Handle compositionstart — user begins IME input */
  const handleCompositionStart = useCallback(
    (event: React.CompositionEvent<HTMLElement>) => {
      compositionIdRef.current += 1;
      setCompositionState({
        isComposing: true,
        compositionText: event.data ?? "",
        lastCommittedText: "",
        compositionData: event.nativeEvent,
      });
      pendingInputQueueRef.current = [];
    },
    []
  );

  /** Handle compositionupdate — intermediate candidate changes */
  const handleCompositionUpdate = useCallback(
    (event: React.CompositionEvent<HTMLElement>) => {
      setCompositionState((prev) => ({
        ...prev,
        compositionText: event.data ?? "",
      }));

      if (onCompositionUpdate) {
        onCompositionUpdate(event.data ?? "");
      }
    },
    [onCompositionUpdate]
  );

  /** Handle compositionend — final character committed */
  const handleCompositionEnd = useCallback(
    (event: React.CompositionEvent<HTMLElement>) => {
      const committedText = event.data ?? "";

      setCompositionState({
        isComposing: false,
        compositionText: "",
        lastCommittedText: committedText,
        compositionData: event.nativeEvent,
      });

      // Now process the committed text through the editor's pipeline
      if (onCommit && committedText) {
        onCommit(committedText);
      }

      // Process any queued input events that arrived during composition
      // (some browsers fire input events after compositionend with the same data)
      if (pendingInputQueueRef.current.length > 0) {
        pendingInputQueueRef.current = [];
      }
    },
    [onCommit]
  );

  /**
   * Reset composition state — useful when the editor is reset
   * or when switching documents.
   */
  const reset = useCallback(() => {
    compositionIdRef.current = 0;
    pendingInputQueueRef.current = [];
    setCompositionState({
      isComposing: false,
      compositionText: "",
      lastCommittedText: "",
      compositionData: null,
    });
  }, []);

  // Attach event listeners to the DOM element directly for native events
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // The native CompositionEvent has isComposing property
    // We attach native listeners to ensure we catch all composition events
    const onStart = (e: Event) =>
      handleCompositionStart(e as unknown as React.CompositionEvent<HTMLElement>);
    const onUpdate = (e: Event) =>
      handleCompositionUpdate(e as unknown as React.CompositionEvent<HTMLElement>);
    const onEnd = (e: Event) =>
      handleCompositionEnd(e as unknown as React.CompositionEvent<HTMLElement>);

    element.addEventListener("compositionstart", onStart);
    element.addEventListener("compositionupdate", onUpdate);
    element.addEventListener("compositionend", onEnd);

    return () => {
      element.removeEventListener("compositionstart", onStart);
      element.removeEventListener("compositionupdate", onUpdate);
      element.removeEventListener("compositionend", onEnd);
    };
  }, [handleCompositionStart, handleCompositionUpdate, handleCompositionEnd]);

  // Expose handlers for React event system usage
  const handlers = useMemo(
    () => ({
      onCompositionStart: handleCompositionStart,
      onCompositionUpdate: handleCompositionUpdate,
      onCompositionEnd: handleCompositionEnd,
    }),
    [handleCompositionStart, handleCompositionUpdate, handleCompositionEnd]
  );

  return {
    ...compositionState,
    shouldProcessInput,
    ref: elementRef as React.RefObject<HTMLElement | null>,
    reset,
    handlers,
  };
}

// ---------------------------------------------------------------------------
// Interview Notes
// ---------------------------------------------------------------------------

/**
 * KEY INSIGHTS FOR INTERVIEWS:
 *
 * 1. The InputEvent.isComposing property (standard in modern browsers) tells
 *    you whether an input event fired during an active IME composition.
 *    This is the most reliable way to gate input processing.
 *
 * 2. Some browsers (notably Safari) have buggy composition event behavior.
 *    The compositionend event.data may be empty even though text was committed.
 *    Fallback: read the text content directly from the element on compositionend.
 *
 * 3. Custom keybindings (e.g., Ctrl+B for bold) should be DISABLED during
 *    IME composition. The IME may use the same keystrokes (e.g., Enter to
 *    commit a candidate). Check isComposing before processing shortcuts.
 *
 * 4. For contenteditable, the browser may insert the composition text into
 *    the DOM during composition. Don't fight this — let the browser manage
 *    the IME UI, then read the final state on compositionend.
 *
 * 5. Virtual keyboards on mobile (especially Gboard for Japanese) may not
 *    fire composition events consistently. Always have a fallback path
 *    that reads the element's textContent directly.
 */
