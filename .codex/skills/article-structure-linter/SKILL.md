---
name: article-structure-linter
description: Validate article TSX files in this system-design-prep repository against the required section order and article rules from AGENTS.md. Use when Codex must check that an article has the required sections, keeps interview questions second-last and references last, avoids code examples, and follows the repository's article structure before merge or before an audit/fix pass.
---

# Article Structure Linter

Validate the shape of an article before treating it as complete. This skill focuses on structural and rule-based correctness, not overall article quality scoring.

## When to Apply

Apply this skill when:

- a new article draft has been generated
- an existing article has been enhanced
- the user asks to validate article structure
- a pre-merge content check is needed
- an audit needs a fast structure-first pass

## Required Inputs

- Article path, or
- Domain, category, sub-category, and topic if the file path still needs to be resolved

If the path is not explicit, resolve it with `hierarchy-topic-resolver`.

## Required Reads

- `AGENTS.md`
- `references/structure-rules.md`
- the target article TSX file

## Suggested Execution Order

1. Resolve the article path if needed.
2. Inspect the TSX file for section headings and their order.
3. Check whether the required sections exist.
4. Check whether interview content is second-last and references are last.
5. Check for code examples, `<pre>` tags, implementation-example sections, and excessive bullet usage.
6. Return a pass/fail style report with concrete violations.

## Required Rules

Validate these requirements:

- `ArticlePage` component exists
- content is divided into semantic `<section>` blocks
- required section sequence is preserved
- `Common interview question with detailed answer` section is second-last
- `References` section is last
- no code blocks or `<pre>` tags are present
- no `Implementation Example` header is present
- no `Example code` content is present
- `ArticleImage` is used for SVG rendering when diagrams are referenced

## Required Section Order

1. Definition & Context
2. Core Concepts
3. Architecture & Flow
4. Trade offs & Comparison
5. Best practices
6. Common Pitfalls
7. Real-world use cases
8. Common interview question with detailed answer
9. References

## Output Contract

Return:

- Article path or article name
- Pass or fail summary
- Violations found
- Missing sections
- Order issues
- Code-block issues
- Suggested fixes

Keep the output concise and directly actionable.

## Guardrails

- Do not rewrite the article unless the user explicitly asks for fixes.
- Do not collapse structure validation into a generic code review.
- Do not mark an article as passing when the section names exist but are out of order.
- Do not ignore examples embedded as JSX or HTML just because they are not fenced Markdown code blocks.

## Reference

- Read `references/structure-rules.md` before finalizing the validation report.
