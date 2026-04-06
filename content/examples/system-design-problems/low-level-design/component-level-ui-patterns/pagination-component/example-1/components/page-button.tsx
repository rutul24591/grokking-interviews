import type { PaginationItem } from "../../lib/pagination-types";

type ButtonType = PaginationItem["type"] | "navigation";
type NavigationDirection = "first" | "prev" | "next" | "last";

interface PageButtonBaseProps {
  type: "page";
  value: number;
  isActive: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

interface EllipsisButtonProps {
  type: "ellipsis";
  value?: null;
  onClick?: never;
  ariaLabel?: never;
  isActive?: never;
  disabled?: never;
}

interface NavigationButtonProps {
  type: "navigation";
  direction: NavigationDirection;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  isActive?: never;
  value?: never;
}

type PageButtonProps = PageButtonBaseProps | EllipsisButtonProps | NavigationButtonProps;

const NAVIGATION_ICONS: Record<NavigationDirection, string> = {
  first: "M18.75 6.75L11.25 14.25L3.75 6.75",
  prev: "M15.75 19.5L8.25 12L15.75 4.5",
  next: "M8.25 4.5L15.75 12L8.25 19.5",
  last: "M3.75 6.75L11.25 14.25L18.75 6.75",
};

export function PageButton(props: PageButtonProps) {
  if (props.type === "ellipsis") {
    return (
      <span
        className="flex items-center justify-center w-9 h-9 text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      >
        ...
      </span>
    );
  }

  if (props.type === "navigation") {
    const { direction, onClick, ariaLabel, disabled = false } = props;

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-disabled={disabled ? "true" : undefined}
        className={`
          flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium
          transition-colors duration-150
          ${disabled
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        `}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={NAVIGATION_ICONS[direction]} />
        </svg>
      </button>
    );
  }

  const { value, isActive, onClick, ariaLabel, disabled = false } = props;

  if (isActive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current="page"
        aria-label={ariaLabel}
        className="flex items-center justify-center w-9 h-9 rounded-md text-sm font-bold bg-blue-600 text-white dark:bg-blue-500"
      >
        {value}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled ? "true" : undefined}
      className={`
        flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium
        transition-colors duration-150
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700
      `}
    >
      {value}
    </button>
  );
}
