import { readFile } from "node:fs/promises";
import path from "node:path";
import { SubCategoryCards } from "@/components/SubCategoryCards";
import { parseFrontendConcepts } from "@/lib/parseFrontendConcepts";

export default async function HomePage() {
  const frontendConceptsPath = path.join(
    process.cwd(),
    "concepts",
    "frontend-concepts.txt",
  );
  const frontendConceptsRaw = await readFile(frontendConceptsPath, "utf8");
  const frontendSubCategories = parseFrontendConcepts(frontendConceptsRaw);

  return <SubCategoryCards frontendSubCategories={frontendSubCategories} />;
}
