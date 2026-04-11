"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

type HighlightsContextValue = {
  highlightsOn: boolean;
  setHighlightsOn: Dispatch<SetStateAction<boolean>>;
};

export const HighlightsContext = createContext<HighlightsContextValue>({
  highlightsOn: false,
  setHighlightsOn: () => {},
});

type HighlightsProviderProps = {
  children: ReactNode;
  value: HighlightsContextValue;
};

export function HighlightsProvider({
  children,
  value,
}: HighlightsProviderProps) {
  return (
    <HighlightsContext.Provider value={value}>
      {children}
    </HighlightsContext.Provider>
  );
}

export function useHighlights(): HighlightsContextValue {
  const context = useContext(HighlightsContext);
  if (!context) {
    throw new Error(
      "useHighlights must be used within a HighlightsProvider"
    );
  }
  return context;
}
