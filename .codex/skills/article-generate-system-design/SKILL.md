---
name: article-generate-system-design
description: Generate a brand new TSX article for this system-design-prep repository using the locked article structure, deep interview-focused content, 4-6 detailed interview questions, references, and 3-5 SVG diagrams. Use when a topic does not yet have an article and the request is to create one that matches AGENTS.md and existing reference articles.
---

# Article Generate System Design

Create a new article draft that matches this repo's article contract. Keep the output aligned to the project, not to generic blog structure.

## When to Apply

Apply this skill only when the topic does not already have a production article and the user wants a new article created. If an article already exists, use enhancement or audit workflows instead of rewriting from scratch.

## Required Inputs

- Domain
- Category
- Sub-category
- Topic

Resolve the topic with `hierarchy-topic-resolver` before writing. If the topic does not exist in `concepts/hierarchy-data.txt`, stop and ask the user.

## Required Reads

Read only what is necessary:

- `AGENTS.md`
- `concepts/hierarchy-data.txt`
- One or two referenced article examples from `AGENTS.md`
- `references/article-checklist.md`

Prefer sibling articles in the same sub-category over unrelated reference articles.

## Suggested Execution Order

1. Resolve the topic and target path with `hierarchy-topic-resolver`.
2. Inspect one or two sibling articles in the same area of `content/`.
3. Build a section-by-section outline that follows the locked order.
4. Decide which 3-5 SVG concepts best teach the topic.
5. Write the TSX draft.
6. Run a self-check against `references/article-checklist.md`.

## Output Contract

Produce a React TSX functional component named `ArticlePage` that:

- Uses semantic `<section>` blocks
- Uses `h1`, `h2`, and `h3` hierarchies
- Uses `<ArticleImage />` for SVGs
- Uses Tailwind utility classes consistent with the repo
- Avoids code samples and `<pre>` blocks
- can be dropped into the repo with minimal cleanup

## Locked Section Order

Preserve this order:

1. Definition & Context
2. Core Concepts
3. Architecture & Flow
4. Trade offs & Comparison
5. Best practices
6. Common Pitfalls
7. Real-world use cases
8. Common interview question with detailed answer
9. References

Additional sections are allowed only if they help the topic and do not move interview questions from second-last or references from last.

## Content Standards

- Write for staff and principal engineer depth.
- Prefer paragraphs over bullet-heavy exposition.
- Cover production trade-offs, scaling behavior, failure modes, and operational realities.
- Include 4-6 interview questions with detailed answers.
- Target exhaustive depth rather than generic explanation.
- Explain why teams choose the pattern, where it breaks down, and which alternatives compete with it.
- Use concrete production scenarios rather than purely academic descriptions.

## Diagram Standards

- Plan for exactly 3-5 SVG diagrams.
- Each diagram should explain one of: architecture, scaling, failover, consistency, or performance trade-offs.
- Do not embed Mermaid.
- If the draft does not include the SVG files yet, include clear `ArticleImage` placeholders with intended filenames and captions.

## Writing Rules

- Keep the article paragraph-driven. Use bullets only when the material is inherently list-shaped.
- Do not let the section content collapse into definitions without trade-offs.
- Avoid toy-system framing unless it is immediately connected to production implications.
- Use exact topic terminology consistently through headings and prose.
- Keep interview questions challenging enough for senior-level preparation.

## Completion Criteria

The draft is ready only when:

- the required sections are present in order
- references are last
- interview Q and A is second-last
- 4-6 detailed questions are included
- no code blocks or implementation-example sections exist
- 3-5 SVG targets are planned or referenced
- the content feels specific to the topic, not reusable boilerplate

## Guardrails

- Do not generate example code inside the article.
- Do not change existing content unless the task is explicitly generation for a missing article.
- Do not break the required section order.
- Use repo naming and path conventions from existing sibling articles.
- If the user asks for a topic outside the hierarchy file, stop instead of improvising a new article path.

## Reference

- Read `references/article-checklist.md` before finalizing the draft.
