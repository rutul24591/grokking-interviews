# QWEN.md - Project Context Guide

## Project Overview

**Interview Prep Studio** is a comprehensive interview preparation knowledge platform built for system design and software engineering interviews. The application provides hierarchical, in-depth content organized by frontend and backend concepts, targeting staff/principal engineer level preparation.

### Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 4 + CSS Variables |
| **State** | Zustand (with persist middleware) |
| **Animations** | Framer Motion |
| **Package Manager** | pnpm |
| **React** | 19.2.3 |

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Scan code snippets for validation
pnpm scan:code-snippets
pnpm scan:code-snippets:fix  # Auto-fix issues
```

## Architecture Overview

### Directory Structure

```
system-design-prep/
├── app/                      # Next.js App Router (Server Components)
│   ├── [category]/           # Dynamic category pages
│   ├── globals.css           # Global styles + Tailwind
│   ├── layout.tsx            # Root layout with font + data loading
│   ├── page.tsx              # Home page
│   └── sitemap.ts            # Sitemap generation
├── components/               # Shared UI components
│   ├── articles/             # Article layout components
│   ├── AppLayout.tsx         # Main app layout wrapper
│   ├── Breadcrumbs.tsx       # Navigation breadcrumbs
│   ├── CategoryPage*.tsx     # Category page components
│   ├── ContentArea.tsx       # Content rendering area
│   ├── SubCategory*.tsx      # Subcategory components
│   └── TopBar.tsx            # Top navigation bar
├── concepts/                 # Source text files defining content hierarchy
│   ├── frontend-concepts.txt # 30 frontend topic categories
│   ├── backend-concepts.txt  # 13 backend topic categories
│   └── *.md                  # Additional concept documentation
├── content/                  # Article content organized by hierarchy
│   ├── articles/             # TSX article files (concise/extensive)
│   │   ├── backend/
│   │   └── frontend/
│   ├── system-design-concepts/ # MDX content by category
│   ├── metadata/             # Article metadata files
│   └── registry.ts           # Article registry with loaders
├── features/                 # Feature modules (co-located state + logic)
│   ├── articles/             # Article-related features
│   ├── network-status/       # Network connectivity indicator
│   ├── sidebar/              # Navigation sidebar with Zustand store
│   └── theme/                # Dark/light theme management
├── lib/                      # Utility functions
│   ├── parse*.ts             # Concept file parsers
│   ├── *-data-context.tsx    # Data context providers
│   ├── article-loader.ts     # Dynamic article loading
│   └── constants.ts          # Shared constants
├── types/                    # TypeScript type definitions
│   └── article.ts            # Article metadata + registry types
├── styles/                   # Global CSS + theme definitions
│   ├── theme.css             # CSS variables for theming
│   └── animations.css        # Animation definitions
└── scripts/                  # Utility scripts
    ├── generate-article-stub.ts
    └── scan-code-snippets.ts
```

### Content Hierarchy

The platform organizes content in a 5-level hierarchy:

1. **Category** - Top-level: "System Design Concepts" (frontend/backend)
2. **SubCategory** - Major topic groups (e.g., "Rendering Strategies", "Caching")
3. **SubCategoryItem** - Specific concept areas (e.g., "Client-Side Rendering")
4. **Topic** - Individual topics within concept areas
5. **Article** - Actual content files with in-depth information

**Content Source Files** (`concepts/`):
- `frontend-concepts.txt` - 30 categories covering rendering, performance, caching, state management, security, etc.
- `backend-concepts.txt` - 13 categories covering databases, caching, networking, distributed systems, reliability, security, etc.

**Content Format**:
```
1. Section Name
• Topic One
• Topic Two
```

Parsed by `lib/parseFrontendConcepts.ts` and `lib/parseBackendConcepts.ts` which generate unique IDs via slugification.

### State Management

**Zustand stores** with `persist` middleware for localStorage persistence:

#### Sidebar Store (`features/sidebar/sidebar.store.ts`)
```typescript
type SidebarState = {
  expandedIds: string[];        // Expanded navigation items
  mobileOpen: boolean;          // Mobile sidebar state
  selectedSubCategoryId: string | null;
  selectedSubCategoryItemId: string | null;
  selectedTopicId: string | null;
  // Actions: toggleExpanded, setNavigationState, etc.
}
```

**SSR Handling**: Uses `skipHydration: true` and conditional storage access (`typeof window` check).

#### Theme Store (`features/theme/theme.store.ts`)
- Manages light/dark/system theme preferences
- Persists to localStorage with SSR-safe patterns

### Server vs Client Components

| Server Components (default) | Client Components ("use client") |
|-----------------------------|----------------------------------|
| `app/page.tsx`              | Feature stores (Zustand)         |
| `app/layout.tsx`            | Interactive components           |
| Data fetching               | Components with state/effects    |
| Static content generation   | Browser API usage                |

## Key Patterns & Conventions

### Article Registry Pattern

Articles are registered in `content/registry.ts` with metadata and dynamic loaders:

```typescript
export const articleRegistry: ArticleRegistry = {
  "backend/caching-performance/cache-invalidation": {
    metadata: {
      id: "article-backend-cache-invalidation-extensive",
      title: "Cache Invalidation",
      description: "Deep guide to cache invalidation techniques...",
      category: "backend",
      subcategory: "caching-performance",
      slug: "cache-invalidation",
      wordCount: 8928,
      readingTime: 45,
      lastUpdated: "2026-03-10",
      tags: ["backend", "caching", "performance", "redis"],
      relatedTopics: ["caching-strategies", "cache-eviction-policies"],
    },
    loader: () => import("./articles/backend/caching-performance/cache-invalidation-concise"),
  },
};
```

### Path Alias

`@/*` maps to the root directory (configured in `tsconfig.json`).

### Styling System

**Tailwind CSS 4** with custom CSS variable theming:

```css
/* Custom utility classes */
.bg-theme, .text-theme, .border-theme
.bg-panel, .bg-panel-soft, .bg-panel-hover
.shadow-soft-theme, .shadow-strong-theme
```

**Responsive Design**: Mobile-first approach with `lg:` breakpoint for desktop sidebar.

### Content Authoring Requirements

Per `AGENTS.md`, each extensive article must include:

1. **In-depth information** suitable for staff/principal engineer interview prep
2. **Comprehension-focused code examples** tied to the concept (not generic)
3. **2-3 images** related to the concept (use SVG from publicly available sources, NOT Mermaid)

## Adding New Content

### Step 1: Update Concept Definition

Add to `concepts/frontend-concepts.txt` or `concepts/backend-concepts.txt`:

```
1. New Subcategory Name
• Topic One
• Topic Two
```

### Step 2: Create Content File

Create article in appropriate directory:
```
content/articles/{category}/{subcategory}/{slug}-concise.tsx
content/articles/{category}/{subcategory}/{slug}-extensive.tsx
```

### Step 3: Update Registry

Add entry to `content/registry.ts` with metadata and loader.

### Step 4: Update Mock Data (if needed)

For development, update `features/sidebar/sidebar.mock.ts`.

## Image Handling

Images are configured in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "upload.wikimedia.org" },
    { protocol: "https", hostname: "mdn.github.io" },
    { protocol: "https", hostname: "developer.mozilla.org" },
  ],
}
```

Use the `ArticleImage` component from `components/articles/ArticleImage.tsx`.

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, font loading, concept parsing |
| `content/registry.ts` | Article registry with metadata + loaders |
| `features/sidebar/sidebar.store.ts` | Sidebar state management |
| `lib/parseFrontendConcepts.ts` | Frontend concept file parser |
| `lib/parseBackendConcepts.ts` | Backend concept file parser |
| `types/article.ts` | Article metadata and registry types |
| `styles/theme.css` | CSS variables for theming |
| `AGENTS.md` | Development guidelines |

## Testing & Quality

- **TypeScript**: Strict mode enabled (`strict: true`)
- **ESLint**: Next.js recommended config with TypeScript
- **Code Snippet Scanning**: Custom script validates code examples

## Deployment

The project supports both:
- **Standard Next.js deployment** (default)
- **Static export** (uncomment `output: "export"` in `next.config.ts`)

Recommended deployment: **Vercel Platform** (creators of Next.js).
