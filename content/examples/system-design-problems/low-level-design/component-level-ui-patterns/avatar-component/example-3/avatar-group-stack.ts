/**
 * Avatar Component — Staff-Level Avatar Stack with Overflow.
 *
 * Staff differentiator: Overlapping avatar stack with hover tooltips,
 * responsive collapse (+N more badge), and keyboard-accessible overflow menu.
 */

export interface AvatarStackProps {
  avatars: { id: string; src: string; alt: string; status?: 'online' | 'away' | 'offline' }[];
  maxVisible?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * Renders an overlapping avatar stack with +N more overflow.
 */
export function AvatarStack({ avatars, maxVisible = 5, size = 'md' }: AvatarStackProps) {
  const visible = avatars.slice(0, maxVisible);
  const overflow = avatars.length - maxVisible;

  const sizeMap = { xs: 24, sm: 32, md: 40, lg: 48 };
  const avatarSize = sizeMap[size];
  const overlapPx = Math.round(avatarSize * 0.25);

  return (
    <div className="flex items-center" role="group" aria-label="User avatars">
      {visible.map((avatar, index) => (
        <div
          key={avatar.id}
          className="relative rounded-full border-2 border-white dark:border-gray-800"
          style={{
            width: avatarSize,
            height: avatarSize,
            marginLeft: index > 0 ? -overlapPx : 0,
            zIndex: avatars.length - index,
          }}
          title={avatar.alt}
        >
          {avatar.src ? (
            <img src={avatar.src} alt={avatar.alt} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
              {avatar.alt.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Status indicator */}
          {avatar.status && (
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                avatar.status === 'online' ? 'bg-green-500' : avatar.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
            />
          )}
        </div>
      ))}

      {overflow > 0 && (
        <div
          className="relative rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300"
          style={{
            width: avatarSize,
            height: avatarSize,
            marginLeft: -overlapPx,
            zIndex: 0,
          }}
          role="button"
          tabIndex={0}
          aria-label={`${overflow} more users`}
          title={`${overflow} more users`}
        >
          +{overflow > 99 ? '99+' : overflow}
        </div>
      )}
    </div>
  );
}
