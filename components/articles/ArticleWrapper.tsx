"use client";

import type { ComponentType } from "react";

type ArticleWrapperProps = {
  Component: ComponentType;
};

export function ArticleWrapper({ Component }: ArticleWrapperProps) {
  return <Component />;
}
