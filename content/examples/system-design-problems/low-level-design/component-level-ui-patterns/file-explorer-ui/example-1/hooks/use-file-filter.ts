import { useMemo } from "react";
import type { FileItem, FilterCriteria, FileCategory } from "../lib/explorer-types";

function matchesText(file: FileItem, text: string): boolean {
  if (!text) return true;
  return file.name.toLowerCase().includes(text.toLowerCase());
}

function matchesCategory(file: FileItem, category: FileCategory | null): boolean {
  if (!category) return true;
  return file.category === category;
}

function matchesDateRange(
  file: FileItem,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start && !end) return true;

  const fileDate = new Date(file.modifiedAt).getTime();

  if (start && fileDate < start.getTime()) return false;
  if (end && fileDate > end.getTime()) return false;

  return true;
}

function matchesSizeRange(
  file: FileItem,
  min: number | null,
  max: number | null
): boolean {
  if (min === null && max === null) return true;

  if (min !== null && file.size < min) return false;
  if (max !== null && file.size > max) return false;

  return true;
}

function matchesAllCriteria(
  file: FileItem,
  criteria: FilterCriteria
): boolean {
  return (
    matchesText(file, criteria.text) &&
    matchesCategory(file, criteria.category) &&
    matchesDateRange(file, criteria.dateRange.start, criteria.dateRange.end) &&
    matchesSizeRange(file, criteria.sizeRange.min, criteria.sizeRange.max)
  );
}

export function useFileFilter(
  files: FileItem[],
  filter: FilterCriteria
): FileItem[] {
  return useMemo(() => {
    // Early return if no filters active
    const hasActiveFilters =
      filter.text !== "" ||
      filter.category !== null ||
      filter.dateRange.start !== null ||
      filter.dateRange.end !== null ||
      filter.sizeRange.min !== null ||
      filter.sizeRange.max !== null;

    if (!hasActiveFilters) return files;

    return files.filter((file) => matchesAllCriteria(file, filter));
  }, [files, filter]);
}
