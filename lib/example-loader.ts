import fs from "fs/promises";
import path from "path";
import type { ExampleFile, ExampleGroup } from "@/types/examples";

async function loadExampleFiles(dir: string): Promise<ExampleFile[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: ExampleFile[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const name = entry.name;
    const filePath = path.join(dir, name);
    const content = await fs.readFile(filePath, "utf8");
    files.push({ name, path: filePath, content });
  }

  return files.sort((a, b) => {
    if (a.name === "README.md") return -1;
    if (b.name === "README.md") return 1;
    return a.name.localeCompare(b.name);
  });
}

function parseExampleIndex(dirName: string): number | null {
  const match = /^example-(\d+)$/i.exec(dirName);
  if (!match) return null;
  return Number(match[1]);
}

export async function getExampleGroups(
  category: string,
  subcategory: string,
  topic: string
): Promise<ExampleGroup[]> {
  const dir = path.join(
    process.cwd(),
    "content",
    "examples",
    category,
    subcategory,
    topic
  );

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const exampleDirs = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        name: entry.name,
        index: parseExampleIndex(entry.name),
      }))
      .filter((entry) => entry.index !== null) as {
      name: string;
      index: number;
    }[];

    if (exampleDirs.length > 0) {
      const sorted = exampleDirs.sort((a, b) => a.index - b.index);
      const groups: ExampleGroup[] = [];
      for (const entry of sorted) {
        const examplePath = path.join(dir, entry.name);
        const files = await loadExampleFiles(examplePath);
        if (files.length === 0) continue;
        groups.push({
          id: entry.name.toLowerCase(),
          label: `Example ${entry.index}`,
          files,
        });
      }
      return groups;
    }

    const files = await loadExampleFiles(dir);
    if (!files.length) return [];
    return [
      {
        id: "example-1",
        label: "Example 1",
        files,
      },
    ];
  } catch (error) {
    return [];
  }
}
