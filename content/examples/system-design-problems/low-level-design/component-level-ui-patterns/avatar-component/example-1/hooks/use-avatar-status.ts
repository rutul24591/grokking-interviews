import type { UserStatus } from '../lib/avatar-types';
import { STATUS_COLORS, STATUS_LABELS, STATUS_TITLES } from '../lib/avatar-types';

interface UseAvatarStatusReturn {
  colorClass: string;
  ariaLabelSuffix: string;
  tooltipTitle: string;
}

/**
 * Hook that maps UserStatus to visual colors, accessibility labels, and tooltip text.
 *
 * Returns default values for undefined status.
 */
export function useAvatarStatus(status: UserStatus | undefined): UseAvatarStatusReturn {
  if (!status) {
    return {
      colorClass: 'bg-gray-400',
      ariaLabelSuffix: '',
      tooltipTitle: '',
    };
  }

  return {
    colorClass: STATUS_COLORS[status],
    ariaLabelSuffix: `, ${STATUS_LABELS[status]}`,
    tooltipTitle: STATUS_TITLES[status],
  };
}
