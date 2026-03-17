# QWEN.md - Interview Prep Studio

## Project Overview

**Interview Prep Studio** is a Next.js 16-based knowledge platform for system design interview preparation. It features a hierarchical content organization system covering frontend and backend concepts, with dark/light theme support, sidebar navigation, and a unique article/example toggle view for code comprehension.

**Tech Stack:**

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 with custom theme tokens
- **State Management:** Zustand with localStorage persistence
- **Animations:** Framer Motion
- **Package Manager:** pnpm

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

# E2E Tests
pnpm test:e2e              # Run Playwright tests
pnpm test:e2e:ui           # Run with UI
pnpm test:e2e:debug        # Debug mode
pnpm test:e2e:report       # Show test report

# Code Snippet Scanning
pnpm scan:code-snippets        # Scan for code snippets
pnpm scan:code-snippets:fix    # Auto-fix issues
```

## Architecture

### Directory Structure

| Directory     | Purpose                                                             |
| ------------- | ------------------------------------------------------------------- |
| `app/`        | Next.js App Router pages and layouts (Server Components by default) |
| `features/`   | Feature modules with co-located state, components, and logic        |
| `components/` | Shared UI components (presentation layer)                           |
| `lib/`        | Utility functions and constants                                     |
| `types/`      | TypeScript type definitions                                         |
| `concepts/`   | Source text files defining content hierarchy (parsed at build time) |
| `content/`    | Markdown/MDX articles organized by category hierarchy               |
| `styles/`     | Global CSS and Tailwind configuration                               |
| `public/`     | Static assets (fonts, images, diagrams)                             |
| `scripts/`    | Utility scripts (article stub generator, code scanner)              |

### Feature Modules

- **`features/theme/`** - Dark/light/system theme management with localStorage persistence
- **`features/network-status/`** - Network connectivity indicator component

### Content Hierarchy

Content follows a 5-level hierarchy:

```
Category (e.g., "System Design Concepts")
  └── SubCategory (e.g., "Frontend Concepts", "Backend Concepts")
      └── SubCategoryItem (e.g., "Rendering Strategies")
          └── Topic (e.g., "Client-Side Rendering")
              └── Article (content files in content/)
```

**Content Definition:**

- `concepts/hierarchy-data.txt` - Defines the hierarchy structure using numbered sections and bullet points
- Content files live in `content/system-design-concepts/{category}/{subcategory}/{slug}.tsx`
- Each article has both "extensive" and "concise" versions

### State Management (Zustand)

Stores use `persist` middleware with SSR-safe patterns:

```typescript
// Theme store (features/theme/theme.store.ts)
export type ThemePreference = "light" | "dark" | "system";

// Key pattern: skipHydration: true + conditional storage access
```

### Server vs Client Components

| Server Components (default)    | Client Components (`"use client"`)         |
| ------------------------------ | ------------------------------------------ |
| `app/page.tsx`                 | Feature modules (sidebar, theme)           |
| `app/layout.tsx`               | Interactive components (AppLayout, TopBar) |
| Data fetching with async/await | Zustand stores                             |
|                                | Components with state/effects/browser APIs |

**Path Alias:** `@/*` maps to root directory (configured in `tsconfig.json`)

## Styling System

**Tailwind CSS 4** with custom theme tokens:

- CSS variables for theming (defined in global CSS)
- Custom utility classes: `bg-theme`, `text-theme`, `border-theme`, `bg-panel`, `shadow-soft-theme`, `shadow-strong-theme`
- Responsive design with mobile-first approach (`lg:` breakpoint for desktop sidebar)
- Framer Motion for animations (page transitions, sidebar overlay)

## Article System

### Article Structure

Each article uses the `ArticleLayout` component with:

- Breadcrumbs navigation
- Article/Example toggle (default: Article view)
- Metadata display (reading time, tags)
- Related topics section

### Article/Example Toggle

Articles have two views:

1. **Article** - Main content with in-depth explanations
2. **Example** - Code examples with multiple files:
   - Example 1: Full-fledged application
   - Example 2+: Smaller focused code snippets

### Content Authoring Requirements

- In-depth information suitable for staff/principal engineer interview prep
- Comprehension-focused code examples tied to the concept
- 2-3 images per article (use SVG from public sources, **not Mermaid**)
- Clear structure with sections: hi

### Adding New Content

1. **Update hierarchy definition** in `concepts/hierarchy-data.txt`:

   ```
   1. New Subcategory Name
   • Topic One
   • Topic Two
   ```

2. **Generate article stubs** using the script:

   ```bash
   pnpm tsx scripts/generate-article-stub.ts \
     --category frontend \
     --subcategory "rendering-strategies" \
     --topic "client-side-rendering" \
     --title "Client-Side Rendering (CSR)"
   ```

3. **Create content file** in `content/system-design-concepts/{category}/{subcategory}/{slug}.tsx`

4. **Update registry** in `content/registry.ts` if needed

## Key Conventions

- **TypeScript:** Strict mode enabled (`strict: true`)
- **Component Design:** Prefer composition over inheritance
- **File Organization:** Co-locate related files in feature directories
- **Accessibility:** Use semantic HTML and accessible patterns
- **SSR Safety:** Check `typeof window` before accessing browser APIs
- **State Persistence:** Store UI state in Zustand, persist preferences to localStorage
- **Code Style:** ESLint with Next.js config (see `eslint.config.mjs`)

## Type Definitions

### Article Types (`types/article.ts`)

```typescript
export type ArticleMetadata = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  slug: string;
  version?: "concise" | "extensive";
  wordCount: number;
  readingTime: number;
  lastUpdated: string;
  tags: string[];
  relatedTopics?: string[];
};
```

### Content Types (`types/content.ts`)

```typescript
export type Category = {
  id: string;
  name: string;
  subCategories: SubCategory[];
};
// ... SubCategory, SubCategoryItem, Topic, Article
```

### Example Types (`types/examples.ts`)

```typescript
export type ExampleFile = {
  name: string;
  path: string;
  content: string;
};

export type ExampleGroup = {
  id: string;
  label: string;
  files: ExampleFile[];
};
```

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

Use the `ArticleImage` component for consistent image rendering with proper alt text and captions.

## Testing

**Playwright** for E2E testing:

- Tests located in `tests/` directory (create as needed)
- Configuration in `playwright.config.ts`
- Use `--ui` flag for interactive test development
- Use `--debug` for step-through debugging

## Scripts

### `generate-article-stub.ts`

Generates article stub files with template content for both extensive and concise versions. Updates registry and metadata automatically.

### `scan-code-snippets.ts`

Scans code snippets for issues (implementation details in script).
