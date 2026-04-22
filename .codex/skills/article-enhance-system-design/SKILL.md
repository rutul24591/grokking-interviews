---
name: article-enhance-system-design
description: Improve an existing TSX article in this system-design-prep repository without rewriting it from scratch. Use when an article already exists but needs more depth, stronger trade-off analysis, missing sections filled in, missing or better SVG planning, improved references, cleaner interview questions, or removal of code-example style content so it matches the AGENTS.md article contract.
---

# Article Enhance System Design

Upgrade an existing article to the repository standard. Preserve the article's core topic and structure while correcting incompleteness, weak depth, repetition, or missing visual and reference material.

## When to Apply

Apply this skill when:

- an article already exists for the topic
- the user asks to enhance or improve an article
- an audit has already identified gaps that need to be fixed
- the article is structurally present but not deep enough for senior-level preparation
- SVGs, references, or interview content are incomplete or weak

Do not use this skill to create a missing article from scratch. Use `article-generate-system-design` for that.

## Required Inputs

- Domain
- Category
- Sub-category
- Topic, or explicit article path
- Optional audit findings, if an audit already exists

Resolve the article path with `hierarchy-topic-resolver` if the caller did not provide one.

## Required Reads

- `AGENTS.md`
- the target article TSX file
- `references/enhancement-checklist.md`
- one or two strong sibling articles from the same area of `content/`
- the latest audit output, if available

## Suggested Execution Order

1. Resolve the exact article path.
2. Inspect the article to identify what already works and what is missing.
3. Compare the article against the locked section order and repo expectations.
4. If an audit exists, use it as the primary backlog for improvement.
5. Strengthen weak sections instead of replacing good sections unnecessarily.
6. Add or improve SVG planning where visuals are missing or too generic.
7. Improve interview questions, references, and production trade-off analysis.
8. Run a final self-check against `references/enhancement-checklist.md`.

## Primary Enhancement Targets

Focus on these categories:

- missing required sections
- shallow treatment of core concepts
- weak architecture or flow explanation
- thin trade-off analysis
- generic best practices or pitfalls
- lack of real-world use cases
- weak or missing interview questions and answers
- weak or missing references
- missing SVGs or placeholder visual thinking
- repetitive wording or list-heavy content
- code-example style sections that should not exist in the article

## Structural Rules

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

Additional sections are acceptable only if they help the topic and do not move interview questions from second-last or references from last.

## Editing Strategy

- Prefer targeted enhancement over wholesale rewriting.
- Keep strong existing sections and deepen them.
- Replace weak generic prose with topic-specific discussion.
- Convert bullet-heavy notes into paragraph-style explanation where appropriate.
- Remove example-code sections, `<pre>` tags, and implementation-example content from the article body.
- Keep the article aligned to its current file path and naming unless the user explicitly wants restructuring.

## Content Standards

- Write for staff and principal engineer depth.
- Make trade-offs concrete: latency, complexity, operability, consistency, cost, reliability, and failure modes.
- Keep the article specific to the topic rather than using reusable generic system design filler.
- Include 4-6 detailed interview questions with strong answers.
- Improve references so they are credible and technically useful.

## Diagram Standards

- Ensure the article supports exactly 3-5 SVG diagrams when the topic warrants them.
- If SVG files are not being created in the same task, improve the diagram plan and `ArticleImage` usage so SVG work can follow cleanly.
- Keep diagrams aligned with the allowed types from `AGENTS.md`: architecture, scaling, failover, consistency, and performance trade-offs.

## Completion Criteria

The enhancement is ready only when:

- the article remains in the required section order
- references are last
- interview Q and A is second-last
- missing or weak sections have been materially improved
- code-example style content has been removed
- SVG needs are clearly satisfied or explicitly prepared for follow-up
- the article reads as a stronger topic-specific piece rather than a lightly edited draft

## Guardrails

- Do not convert an enhancement task into a full rewrite unless the user explicitly asks for replacement.
- Do not invent a new topic or path outside `concepts/hierarchy-data.txt`.
- Do not add code examples to article content.
- Do not break the required section order while inserting new material.
- Do not remove useful existing content simply to make the article shorter.

## Reference

- Read `references/enhancement-checklist.md` before finalizing the changes.
