import { readFile } from "node:fs/promises";
import path from "node:path";
import { SubCategoryCards } from "@/components/SubCategoryCards";
import { parseBackendConcepts } from "@/lib/parseBackendConcepts";
import { parseFrontendConcepts } from "@/lib/parseFrontendConcepts";

export default async function HomePage() {
  const frontendConceptsPath = path.join(
    process.cwd(),
    "concepts",
    "frontend-concepts.txt",
  );
  const frontendConceptsRaw = await readFile(frontendConceptsPath, "utf8");
  const frontendSubCategories = parseFrontendConcepts(frontendConceptsRaw);
  const backendConceptsPath = path.join(
    process.cwd(),
    "concepts",
    "backend-concepts.txt",
  );
  const backendConceptsRaw = await readFile(backendConceptsPath, "utf8");
  const backendSubCategories = parseBackendConcepts(backendConceptsRaw);

  return (
    <SubCategoryCards
      frontendSubCategories={frontendSubCategories}
      backendSubCategories={backendSubCategories}
    />
  );
}
