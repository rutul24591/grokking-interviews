import { systemDesignConceptsArticles } from "./system-design-concepts";
import { requirementsArticles } from "./requirements";
import { systemDesignProblemsArticles } from "./system-design-problems";
import { otherArticles } from "./other";

export const subcategoryArticles: Record<string, Array<{slug: string; title: string; description: string}>> = {
  ...systemDesignConceptsArticles,
  ...requirementsArticles,
  ...systemDesignProblemsArticles,
  ...otherArticles,
};
