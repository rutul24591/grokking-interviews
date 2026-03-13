# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interview preparation knowledge platform built with Next.js 16, featuring hierarchical content organization for system design concepts. The app uses a feature-based architecture with Zustand for state management, Tailwind CSS 4 for styling, and Framer Motion for animations.

## Development Commands

**Package Manager**: This project uses `pnpm`, not npm or yarn.

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture Overview

### Directory Structure

- **`app/`** - Next.js App Router pages and layouts (Server Components by default)
- **`features/`** - Feature modules with co-located state, components, and logic
  - `sidebar/` - Navigation sidebar with expand/collapse state
  - `theme/` - Dark/light theme management with localStorage persistence
  - `network-status/` - Network connectivity indicator
- **`components/`** - Shared UI components (presentation layer)
- **`lib/`** - Utility functions and shared constants
- **`types/`** - TypeScript type definitions
- **`concepts/`** - Source text files for content (parsed at build time)
- **`content/`** - Markdown/MDX articles organized by category hierarchy
- **`styles/`** - Global CSS and Tailwind configuration

### State Management

Uses Zustand with middleware patterns:

- **Sidebar state** (`features/sidebar/sidebar.store.ts`): Persisted to localStorage with expand/collapse IDs, selection state, and mobile open state
- **Theme state** (`features/theme/theme.store.ts`): Theme preference (light/dark/system) with localStorage persistence

Key pattern: Stores are created with `persist` middleware and handle SSR with `skipHydration: true` and conditional storage access.

### Content System

Content follows a hierarchical structure:

1. **Category** (e.g., "System Design Concepts")
2. **SubCategory** (e.g., "Frontend Concepts", "Backend Concepts")
3. **SubCategoryItem** (e.g., "Rendering Strategies", "Performance Optimization")
4. **Topic** (e.g., "Client-Side Rendering")
5. **Article** (actual content files in `content/`)

**Content workflow**:

- Text files in `concepts/` directory define the hierarchy (e.g., `frontend-concepts.txt`)
- Format: Numbered sections for SubCategoryItems, bullets for Topics
- Parsed via `lib/parseFrontendConcepts.ts` which generates unique IDs using slugification
- Content files live in `content/system-design-concepts/{category}/{subcategory}/{slug}.tsx`
- Mock data in `features/sidebar/sidebar.mock.ts` shows the full expected structure with articles

### Styling Approach

- **Tailwind CSS 4** with custom theme tokens
- CSS variables for theming (defined in global CSS)
- Custom utility classes: `bg-theme`, `text-theme`, `border-theme`, `bg-panel`, `shadow-soft-theme`, `shadow-strong-theme`
- Responsive design with mobile-first approach (lg: breakpoint for desktop sidebar)
- Framer Motion for animations (page transitions, sidebar overlay)

### Server vs Client Components

- **Server Components** (default): `app/page.tsx`, `app/layout.tsx` - use async/await for data fetching
- **Client Components** (`"use client"`): All components with state, effects, or browser APIs
  - Feature modules (sidebar, theme)
  - Interactive components (AppLayout, TopBar)
  - Zustand stores

Path alias `@/*` maps to root directory (configured in `tsconfig.json`).

## Adding New Content

To add a new concept category or topic:

1. **Update concept definition** in `concepts/` directory:

   ```
   1. New Subcategory Name
   • Topic One
   • Topic Two
   ```

2. **Create content file** in appropriate `content/` subdirectory following existing structure

3. **Update mock data** in `features/sidebar/sidebar.mock.ts` if needed for development

## Key Conventions

- Use strict TypeScript (`strict: true` in tsconfig)
- Prefer composition over inheritance for components
- Co-locate related files in feature directories
- Use semantic HTML and accessible patterns
- Handle SSR/hydration carefully - check for `typeof window` before accessing browser APIs
- Store UI state (expanded items, selections) in Zustand
- Persist user preferences (theme, sidebar state) to localStorage with SSR-safe patterns.
- Each extensive article should possess in depth information for a staff/principal engineer interview prep/research work.
- Each extensive article should also contain a comprehension example of code.
- Do not use Mermaid for diagram creation. We will use svg from publicly available images from web.
