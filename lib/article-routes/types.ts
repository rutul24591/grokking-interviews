import type { ComponentType } from "react";
import type { ArticleMetadata } from "@/types/article";

export type ArticleModule = {
  metadata?: ArticleMetadata;
  default?: ComponentType;
};
