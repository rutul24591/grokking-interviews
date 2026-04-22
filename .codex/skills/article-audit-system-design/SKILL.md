---
name: article-audit-system-design
description: Audit one article or all articles within a sub-category for this system-design-prep repository. Use when Codex must rate article quality out of 10, identify depth and structure issues, check for missing references or SVGs, detect code-block violations, and produce actionable improvement suggestions that match the audit expectations in AGENTS.md.
---

# Article Audit System Design

Audit article quality against this repository's editorial contract. The goal is not to rewrite content during the audit. The goal is to produce a concrete, decision-ready assessment.

## When to Apply

Apply this skill when the user asks to:

- audit a sub-category
- review article quality
- rate one or more articles
- identify missing sections, missing SVGs, or weak depth
- check whether content follows the required order and style

## Required Inputs

- Domain
- Category
- Sub-category
- Optional topic, if the audit is for a single article

Resolve the target set with `hierarchy-topic-resolver` before auditing.

## Required Reads

- `AGENTS.md`
- `concepts/hierarchy-data.txt`
- `references/audit-checklist.md`
- the target article files under `content/`

## Suggested Execution Order

1. Resolve the canonical sub-category and its topics.
2. Locate all corresponding article files in `content/`.
3. Read each article with focus on section order, depth, SVG usage, references, and interview content.
4. Check for code examples, `<pre>` tags, placeholder diagrams, and repetitive wording.
5. Score each article out of 10.
6. Produce the audit output in the exact expected structure.

## Required Checks

For each article, explicitly check:

- repetitive content
- lack of depth against the approximate 5500 word target, allowing reasonable variance
- missing SVGs
- missing references
- whether interview question-answer pairs are present
- structure violations
- structure order violations
- placeholder SVGs
- presence of code examples or code blocks
- presence of `<section>` blocks containing `<pre>`
- presence of headers such as `Implementation Example`
- presence of strings such as `Example code`
- whether the writing is paragraph-heavy rather than bullet-heavy

## Rating Guidance

- `9-10`: Deep, specific, well-structured, interview-ready, visually complete, and low on repetition.
- `7-8`: Strong but missing some depth, references, diagram quality, or structure discipline.
- `5-6`: Usable but clearly incomplete or inconsistent with the repo standard.
- `1-4`: Thin, structurally broken, missing major sections, or not suitable for serious interview preparation.

## Output Contract

Return:

- Sub-category Name

For each article:

- Article Name
- Rating (out of 10)
- Issues Found
- Suggestions

Keep findings concrete. Do not hide the reason for a low score behind generic wording.

## Writing Rules

- Findings should be specific enough that a later enhancement pass can act on them without re-discovering the issue.
- Prefer direct statements over vague quality language.
- Mention missing or broken sections by name.
- Mention whether references and interview Q&A are present, not just whether they are good.

## Guardrails

- Do not edit article files during the audit unless the user explicitly changes the task from audit to fix.
- Do not assume topics outside `concepts/hierarchy-data.txt`.
- Do not treat placeholder SVG imports as valid finished diagrams.
- Do not ignore order violations just because the sections exist.

## Reference

- Read `references/audit-checklist.md` before finalizing the audit.
