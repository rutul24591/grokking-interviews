import type { PaginationItem, PageRange } from "./pagination-types";

interface PageRangeCalculatorInput {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

function createPageItem(value: number): PaginationItem {
  return { type: "page", value };
}

function createEllipsisItem(): PaginationItem {
  return { type: "ellipsis", value: null };
}

export function computePageRange({
  currentPage,
  totalPages,
  siblingCount = 2,
}: PageRangeCalculatorInput): PageRange {
  if (totalPages <= 0) {
    return { items: [], startItem: 0, endItem: 0, totalItems: 0 };
  }

  const clampedPage = Math.max(1, Math.min(currentPage, totalPages));
  const items: PaginationItem[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      items.push(createPageItem(i));
    }
    return buildPageRange(items, clampedPage);
  }

  const leftBound = Math.max(clampedPage - siblingCount, 2);
  const rightBound = Math.min(clampedPage + siblingCount, totalPages - 1);

  const showLeftEllipsis = leftBound > 2;
  const showRightEllipsis = rightBound < totalPages - 1;

  items.push(createPageItem(1));

  if (showLeftEllipsis) {
    items.push(createEllipsisItem());
  }

  const firstPageAfterEllipsis = showLeftEllipsis ? leftBound - 1 : 2;
  const lastPageBeforeRightEllipsis = showRightEllipsis ? rightBound + 1 : totalPages - 1;

  for (let i = firstPageAfterEllipsis; i <= lastPageBeforeRightEllipsis; i++) {
    items.push(createPageItem(i));
  }

  if (showRightEllipsis) {
    items.push(createEllipsisItem());
  }

  items.push(createPageItem(totalPages));

  return buildPageRange(items, clampedPage);
}

function buildPageRange(items: PaginationItem[], currentPage: number): PageRange {
  return {
    items,
    startItem: 0,
    endItem: 0,
    totalItems: 0,
  };
}

export function computeRangeDisplay(
  currentPage: number,
  pageSize: number,
  totalItems: number
): { startItem: number; endItem: number; totalItems: number } {
  if (totalItems === 0) {
    return { startItem: 0, endItem: 0, totalItems: 0 };
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return { startItem, endItem, totalItems };
}
