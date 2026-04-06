import { useMemo } from "react";
import type { FileItem, SortConfig } from "../lib/explorer-types";

function compareFiles(
  a: FileItem,
  b: FileItem,
  config: SortConfig
): number {
  // Folders always sort above files
  if (a.type === "folder" && b.type !== "folder") return -1;
  if (a.type !== "folder" && b.type === "folder") return 1;

  let comparison = 0;

  switch (config.key) {
    case "name":
      comparison = a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
        numeric: true,
      });
      break;

    case "size":
      comparison = a.size - b.size;
      break;

    case "type": {
      const catA = a.category ?? "other";
      const catB = b.category ?? "other";
      comparison = catA.localeCompare(catB, undefined, {
        sensitivity: "base",
      });
      // If categories are equal, fall back to name comparison
      if (comparison === 0) {
        comparison = a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
          numeric: true,
        });
      }
      break;
    }

    case "dateModified": {
      const dateA = new Date(a.modifiedAt).getTime();
      const dateB = new Date(b.modifiedAt).getTime();
      comparison = dateA - dateB;
      break;
    }
  }

  return config.direction === "asc" ? comparison : -comparison;
}

export function useFileSort(
  files: FileItem[],
  sortConfig: SortConfig
): FileItem[] {
  return useMemo(() => {
    // toSorted() returns a new array and is stable by specification
    return files.toSorted((a, b) => compareFiles(a, b, sortConfig));
  }, [files, sortConfig]);
}
