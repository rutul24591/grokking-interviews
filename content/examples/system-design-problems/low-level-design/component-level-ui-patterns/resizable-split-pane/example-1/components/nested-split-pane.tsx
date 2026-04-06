'use client';

import type { SplitPaneOrientation } from '../lib/split-pane-types';
import { SplitPane } from './split-pane';

interface NestedSplitPaneProps {
  orientation?: SplitPaneOrientation;
  storageKey: string;
  defaultSize?: number;
  pane1Min?: number;
  pane1Max?: number;
  pane2Min?: number;
  pane2Max?: number;
  transitionEnabled?: boolean;
  children: [React.ReactNode, React.ReactNode];
  className?: string;
}

/**
 * NestedSplitPane is a convenience wrapper that renders a SplitPane
 * inside a pane context, enabling recursive composition for arbitrarily
 * complex multi-pane layouts (e.g., three-column IDE with nested splits).
 *
 * Each nested instance manages its own state and persistence independently,
 * using its unique storageKey to avoid localStorage collisions.
 */
export function NestedSplitPane({
  orientation = 'horizontal',
  storageKey,
  defaultSize = 50,
  pane1Min,
  pane1Max,
  pane2Min,
  pane2Max,
  transitionEnabled = true,
  children,
  className = '',
}: NestedSplitPaneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <SplitPane
        orientation={orientation}
        storageKey={storageKey}
        defaultSize={defaultSize}
        pane1Min={pane1Min}
        pane1Max={pane1Max}
        pane2Min={pane2Min}
        pane2Max={pane2Max}
        transitionEnabled={transitionEnabled}
      >
        {children}
      </SplitPane>
    </div>
  );
}
