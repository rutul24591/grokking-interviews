# Avatar Component — Example Explanation

## Overview

This is a production-ready Avatar component implementation with:

- **Fallback chain**: image → initials (from name) → generic user icon
- **Lazy loading**: IntersectionObserver with 50px rootMargin for preloading
- **Error tracking**: Zustand store keyed by URL, with retry limits (max 3)
- **Status indicators**: colored dots (online/offline/away/busy) at bottom-right
- **Avatar groups**: overlapping stacks with "+N more" overflow badge
- **Accessibility**: aria-label, role="img", status announcements, keyboard support
- **Internationalization**: CJK character support, emoji-aware grapheme slicing

## File Structure

```
example-1/
├── lib/
│   ├── avatar-types.ts        — TypeScript interfaces and constants
│   ├── initials-generator.ts  — Name parsing, CJK/emoji handling
│   └── avatar-store.ts        — Zustand store for error tracking
├── hooks/
│   ├── use-avatar-image.ts    — Image loading lifecycle hook
│   └── use-avatar-status.ts   — Status color/label mapping
└── components/
    ├── avatar.tsx             — Main component (compound pattern)
    ├── avatar-image.tsx       — Image renderer with lazy loading
    ├── avatar-fallback.tsx    — Initials or generic icon
    ├── avatar-status.tsx      — Status indicator dot
    └── avatar-group.tsx       — Overlapping avatar stack
```

## Architecture Decisions

### 1. Fallback Chain Design

The component follows a three-tier fallback:

1. **Image**: If `src` is provided and loading succeeds, render `<img>` with `object-fit: cover`.
2. **Initials**: If the image fails, extract initials from `name` using `generateInitials()`. Display in a hash-derived color container.
3. **Generic Icon**: If no `name` is available, render a simple SVG user silhouette.

The fallback transition is synchronous — as soon as `onError` fires on the `<img>`, the component re-renders with the fallback. No animation is applied by default (can be added via Framer Motion).

### 2. Lazy Loading Strategy

Two layers of lazy loading:

- **IntersectionObserver**: Triggers when the avatar enters within 50px of the viewport. Shows a skeleton placeholder until then.
- **Native `loading="lazy"`**: Browser-native lazy loading as a secondary safeguard.

The IntersectionObserver approach gives precise control over when loading begins and allows skeleton placeholders that prevent layout shift (CLS).

### 3. Error Tracking with Zustand

The `useAvatarStore` tracks error state per URL (not per component instance). This is important because:

- The same image URL may appear in multiple avatars (e.g., in a thread where the same user commented multiple times).
- If the URL is broken, all avatars using it should fail consistently.
- Retry on hover should be coordinated — no point retrying from multiple components simultaneously.

The store enforces a maximum of 3 retries per URL per session to prevent network storms.

### 4. Initials Generation

The `generateInitials()` function handles several edge cases:

- **Empty/whitespace**: Returns `null`, triggering the generic icon fallback.
- **Single word**: Returns the first character (e.g., "Madonna" → "M").
- **Multi-word**: Returns first char of first word + first char of last word (e.g., "John Doe" → "JD").
- **CJK names**: Each character is one logical unit. Takes first 2 characters directly (e.g., 王小明 → 王小).
- **Emoji**: Uses `Intl.Segmenter` with `granularity: 'grapheme'` for correct emoji slicing.
- **Color derivation**: DJB2 hash of the name modulo a 20-color palette ensures consistent coloring for the same name.

### 5. Compound Component Pattern

The main `Avatar` component attaches sub-components as static properties:

```tsx
Avatar.Image = AvatarImageWrapper;
Avatar.Fallback = AvatarFallbackWrapper;
Avatar.Status = AvatarStatus;
Avatar.Group = AvatarGroup;
```

This enables flexible composition:

```tsx
<Avatar name="John Doe" size="lg">
  <Avatar.Image src="..." alt="John" />
  <Avatar.Fallback />
  <Avatar.Status status="online" />
</Avatar>
```

Or simple usage with automatic fallback:

```tsx
<Avatar src="..." name="John Doe" status="online" />
```

### 6. Avatar Group

The `AvatarGroup` component:

- Renders up to `max` (default: 4) children with negative left margin for overlap.
- Renders an overflow badge for the remainder (e.g., "+3 more").
- The badge uses the same dimensions as avatars for visual consistency.
- Uses `React.Children.toArray()` for safe child manipulation and `cloneElement()` for injecting margin classes.

### 7. Accessibility

- Each avatar has `role="img"` and `aria-label` with the full name (not initials).
- Status is appended to the aria-label: "John Doe, online".
- The generic icon fallback has `aria-label="Anonymous user"`.
- If the avatar is clickable (`onClick` provided), it gets `tabIndex={0}` and keyboard Enter/Space handling.
- Status dots have `aria-hidden="true"` (status is announced via the parent's aria-label, not the dot itself).

### 8. SSR Safety

- IntersectionObserver is set up in `useEffect`, so it only runs on the client.
- During SSR, the component renders the fallback (since `isInView` defaults to `false`).
- No hydration mismatch occurs because the initial render path is deterministic.

## Usage Examples

### Basic Avatar

```tsx
import Avatar from './components/avatar';

<Avatar src="/users/john.jpg" name="John Doe" size="md" />
```

### Avatar with Status

```tsx
<Avatar
  src="/users/jane.jpg"
  name="Jane Smith"
  size="lg"
  status="online"
/>
```

### Avatar Without Image (Initials Only)

```tsx
<Avatar name="Alex Johnson" size="sm" shape="rounded-square" />
```

### Avatar Group

```tsx
import Avatar from './components/avatar';

<Avatar.Group max={3} size="md">
  <Avatar src="/u1.jpg" name="Alice" />
  <Avatar src="/u2.jpg" name="Bob" />
  <Avatar src="/u3.jpg" name="Charlie" />
  <Avatar src="/u4.jpg" name="Diana" />
  <Avatar src="/u5.jpg" name="Eve" />
</Avatar.Group>
```

### Clickable Avatar

```tsx
<Avatar
  name="John Doe"
  size="xl"
  onClick={() => router.push(`/profile/john`)}
/>
```
