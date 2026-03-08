#!/usr/bin/env node

/**
 * Article Stub Generator
 *
 * Generates stub article files (extensive and concise versions) with:
 * - Directory structure
 * - TSX files with template content
 * - Registry entries
 * - Metadata updates
 *
 * Usage:
 *   pnpm tsx scripts/generate-article-stub.ts \
 *     --category frontend \
 *     --subcategory "rendering-strategies" \
 *     --topic "client-side-rendering" \
 *     --title "Client-Side Rendering (CSR)"
 */

import * as fs from "fs";
import * as path from "path";

// Slugify utility
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options: Record<string, string> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, "");
    const value = args[i + 1];
    options[key] = value;
  }

  return options;
}

// Generate article template
function generateArticleTemplate(
  title: string,
  description: string,
  category: string,
  subcategory: string,
  slug: string,
  version: "extensive" | "concise",
  tags: string[]
): string {
  const today = new Date().toISOString().split("T")[0];
  const idPrefix = `article-${category}-${slug.substring(0, 10)}-${version}`;

  const sections =
    version === "extensive"
      ? `
      <section>
        <h2>Definition & Context</h2>
        <p>TODO: Define ${title} and explain its purpose in modern web development.</p>
        <p>TODO: Provide historical context and evolution of this concept.</p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>TODO: Explain the fundamental concepts and principles.</p>
        <ul>
          <li>TODO: Key concept 1</li>
          <li>TODO: Key concept 2</li>
          <li>TODO: Key concept 3</li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>TODO: Describe the architecture and how data flows through the system.</p>
        {/* TODO: Add architecture diagram */}
        {/*
        <figure className="my-8">
          <Image
            src="/diagrams/${category}/${subcategory}/${slug}-architecture.png"
            alt="${title} Architecture"
            width={800}
            height={600}
            className="rounded-lg border border-theme"
          />
          <figcaption className="mt-2 text-center text-sm text-muted">
            ${title} Architecture Diagram
          </figcaption>
        </figure>
        */}
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>TODO: Provide practical implementation examples.</p>
        <pre>
          <code>{\`// TODO: Add code example
// Example implementation of ${title}
function example() {
  return "implementation";
}\`}</code>
        </pre>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Aspect</th>
              <th className="text-left">Pros</th>
              <th className="text-left">Cons</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Performance</td>
              <td>TODO</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>Developer Experience</td>
              <td>TODO</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>Scalability</td>
              <td>TODO</td>
              <td>TODO</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>TODO: List best practices and common patterns.</p>
        <ol>
          <li>TODO: Best practice 1</li>
          <li>TODO: Best practice 2</li>
          <li>TODO: Best practice 3</li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>TODO: Describe common mistakes and how to avoid them.</p>
        <ul>
          <li>TODO: Pitfall 1</li>
          <li>TODO: Pitfall 2</li>
          <li>TODO: Pitfall 3</li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>TODO: Provide real-world examples and use cases.</p>
        <ul>
          <li>TODO: Use case 1</li>
          <li>TODO: Use case 2</li>
          <li>TODO: Use case 3</li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>TODO: Add reference 1</li>
          <li>TODO: Add reference 2</li>
          <li>TODO: Add reference 3</li>
        </ul>
      </section>
`
      : `
      <section>
        <h2>Quick Overview</h2>
        <p>TODO: Brief definition and key points about ${title}.</p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul>
          <li>TODO: Concept 1</li>
          <li>TODO: Concept 2</li>
          <li>TODO: Concept 3</li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre>
          <code>{\`// TODO: Add concise code example
function example() {
  return "implementation";
}\`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Pros</th>
              <th className="text-left">Cons</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TODO: Pro 1</td>
              <td>TODO: Con 1</td>
            </tr>
            <tr>
              <td>TODO: Pro 2</td>
              <td>TODO: Con 2</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p>TODO: Brief guidance on when this is the right choice.</p>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul>
          <li>TODO: Key point to remember for interviews</li>
          <li>TODO: Common interview question</li>
          <li>TODO: Important trade-off to mention</li>
        </ul>
      </section>
`;

  return `import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "${idPrefix}",
  title: "${title}",
  description: "${description}",
  category: "${category}",
  subcategory: "${subcategory}",
  slug: "${slug}",
  version: "${version}",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "${today}",
  tags: ${JSON.stringify(tags)},
};

export default function ${slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}${version === "extensive" ? "Extensive" : "Concise"}Article() {
  return (
    <ArticleLayout metadata={metadata}>
${sections}
    </ArticleLayout>
  );
}
`;
}

// Update registry
function updateRegistry(
  category: string,
  subcategory: string,
  slug: string,
  title: string,
  description: string,
  tags: string[]
) {
  const registryPath = path.join(process.cwd(), "content", "registry.ts");
  const today = new Date().toISOString().split("T")[0];

  // Read current registry
  let registryContent = fs.readFileSync(registryPath, "utf-8");

  // Generate entries for both versions
  const entries = ["concise", "extensive"].map((version) => {
    const pathKey = `${category}/${subcategory}/${slug}-${version}`;
    const importPath = `./articles/${category}/${subcategory}/${slug}-${version}`;
    const idPrefix = `article-${category}-${slug.substring(0, 10)}-${version}`;

    return `  "${pathKey}": {
    metadata: {
      id: "${idPrefix}",
      title: "${title}",
      description: "${description}",
      category: "${category}",
      subcategory: "${subcategory}",
      slug: "${slug}",
      version: "${version}",
      wordCount: 0,
      readingTime: 0,
      lastUpdated: "${today}",
      tags: ${JSON.stringify(tags)},
    },
    loader: () => import("${importPath}"),
  },`;
  });

  // Insert entries before the closing brace
  const insertPosition = registryContent.lastIndexOf("}");
  const before = registryContent.substring(0, insertPosition);
  const after = registryContent.substring(insertPosition);

  registryContent = `${before}${entries.join("\n")}\n${after}`;

  fs.writeFileSync(registryPath, registryContent, "utf-8");
}

// Update metadata
function updateMetadata(
  category: string,
  subcategory: string,
  slug: string
) {
  const metadataPath = path.join(
    process.cwd(),
    "content",
    "metadata",
    `${category}.json`
  );

  // Read current metadata
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));

  // Initialize subcategory if it doesn't exist
  if (!metadata[subcategory]) {
    metadata[subcategory] = {};
  }

  // Add entries for both versions
  const today = new Date().toISOString().split("T")[0];
  metadata[subcategory][slug] = {
    extensive: {
      status: "draft",
      wordCount: 0,
      lastUpdated: today,
    },
    concise: {
      status: "draft",
      wordCount: 0,
      lastUpdated: today,
    },
  };

  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf-8");
}

// Main function
function main() {
  const options = parseArgs();

  // Validate required arguments
  const required = ["category", "subcategory", "topic", "title"];
  for (const key of required) {
    if (!options[key]) {
      console.error(`Error: Missing required argument --${key}`);
      process.exit(1);
    }
  }

  const { category, subcategory, topic, title } = options;
  const description =
    options.description ||
    `Comprehensive guide to ${title} covering concepts, implementation, and best practices.`;
  const tags = options.tags
    ? options.tags.split(",")
    : [category, subcategory.split("-")[0]];

  const slug = slugify(topic);

  console.log(`\nGenerating article stubs for: ${title}`);
  console.log(`Category: ${category}`);
  console.log(`Subcategory: ${subcategory}`);
  console.log(`Slug: ${slug}\n`);

  // Create directory structure
  const articleDir = path.join(
    process.cwd(),
    "content",
    "articles",
    category,
    subcategory
  );
  fs.mkdirSync(articleDir, { recursive: true });

  // Generate extensive version
  const extensivePath = path.join(articleDir, `${slug}-extensive.tsx`);
  const extensiveContent = generateArticleTemplate(
    title,
    description,
    category,
    subcategory,
    slug,
    "extensive",
    tags
  );
  fs.writeFileSync(extensivePath, extensiveContent, "utf-8");
  console.log(`✓ Created: ${extensivePath}`);

  // Generate concise version
  const concisePath = path.join(articleDir, `${slug}-concise.tsx`);
  const conciseContent = generateArticleTemplate(
    title,
    description,
    category,
    subcategory,
    slug,
    "concise",
    tags
  );
  fs.writeFileSync(concisePath, conciseContent, "utf-8");
  console.log(`✓ Created: ${concisePath}`);

  // Update registry
  updateRegistry(category, subcategory, slug, title, description, tags);
  console.log(`✓ Updated: content/registry.ts`);

  // Update metadata
  updateMetadata(category, subcategory, slug);
  console.log(`✓ Updated: content/metadata/${category}.json`);

  console.log(`\n✅ Article stubs generated successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. Fill in the TODO sections in the article files`);
  console.log(`2. Add diagrams to public/diagrams/${category}/${subcategory}/`);
  console.log(`3. Update word counts and reading times in metadata`);
  console.log(`4. Test the articles at:`);
  console.log(`   - http://localhost:3000/${category}/${subcategory}/${slug}`);
  console.log(
    `   - http://localhost:3000/${category}/${subcategory}/${slug}/extensive\n`
  );
}

main();
