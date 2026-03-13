"use client";

import { createContext } from "react";
import type { ExampleGroup } from "@/types/examples";

export type ExampleContextValue = {
  examples: ExampleGroup[];
};

export const ExampleContext = createContext<ExampleContextValue>({ examples: [] });
