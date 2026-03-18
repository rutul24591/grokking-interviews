import examplesManifest from "@/content/examples-manifest.json";
import type { ExampleGroup } from "@/types/examples";

/**
 * Load examples for an article
 * 
 * Examples are loaded from a build-time generated manifest.
 * Manifest path: content/examples-manifest.json
 */
export async function loadExamples(params: {
  category: string;
  subcategory: string;
  topic: string;
}): Promise<ExampleGroup[]> {
  const { category, subcategory, topic } = params;
  
  // Map category slug from URL to manifest format
  // URL uses "backend-concepts", "frontend-concepts" but manifest uses "backend", "frontend"
  const manifestCategory = category.replace("-concepts", "");
  
  // Build the manifest key
  const manifestKey = `${manifestCategory}/${subcategory}/${topic}`;
  
  // Return examples from manifest (type assertion needed for dynamic key access)
  return (examplesManifest as Record<string, ExampleGroup[]>)[manifestKey] || [];
}
