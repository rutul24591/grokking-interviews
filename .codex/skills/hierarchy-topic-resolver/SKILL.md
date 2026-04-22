---
name: hierarchy-topic-resolver
description: Resolve the canonical domain, category, sub-category, topic, slug, and likely file path for this system-design-prep repository before generating, enhancing, or auditing article content. Use when a request mentions an article topic, a sub-category, or mixed naming such as "System Design" vs "System Design Concepts" and Codex must avoid assuming topic placement.
---

# Hierarchy Topic Resolver

Resolve the exact content location before doing article work. Treat `concepts/hierarchy-data.txt` as the source of truth for which topics belong to a sub-category.

## When to Apply

Apply this skill before:

- generating a new article
- enhancing an existing article
- auditing a sub-category
- creating SVGs for an article
- discussing file paths for a topic that may already exist under a different slug

## Workflow

1. Read `AGENTS.md` and `concepts/hierarchy-data.txt`.
2. Match the requested domain, category, sub-category, and topic against the hierarchy file. Do not infer topics from memory.
3. Normalize naming differences used in conversation versus repo paths.
4. Check whether an article already exists under `content/`.
5. Return the canonical metadata needed by the next skill.
6. If the request conflicts with the hierarchy file, stop and ask the user to clarify rather than continuing with a guessed mapping.

## Fast Search Pattern

Prefer these checks:

```bash
rg -n "<sub-category>|<topic>" concepts/hierarchy-data.txt
rg --files content | rg "<topic-slug>|<subcategory-slug>"
```

If the first search shows the topic under a different sub-category than the request, surface that mismatch explicitly.

## Normalization Rules

- Treat user phrasing and repo phrasing as potentially different. For example, the user may say `System Design` while repo paths may use `system-design-concepts`.
- Preserve the exact topic title for the article heading, but derive slug candidates from existing repo naming patterns rather than inventing a new convention.
- If more than one plausible match exists, stop and ask the user to choose. Do not guess.

## Output Contract

Return a compact resolution block with:

- Canonical domain
- Canonical category
- Canonical sub-category
- Canonical topic
- Existing article path, if present
- Expected article path, if absent
- Any ambiguity that needs user confirmation

The output should be concise and directly reusable by downstream article or SVG work.

## File Discovery

- Use `concepts/hierarchy-data.txt` as the primary source of truth.
- Use `rg` against `content/` to find existing article files.
- Use reference articles from `AGENTS.md` only to infer formatting and naming patterns, not topic membership.

## Stop Conditions

Stop and ask the user when:

- the topic is missing from `concepts/hierarchy-data.txt`
- multiple topic names look like plausible matches
- the requested sub-category conflicts with the hierarchy file
- repo naming patterns are inconsistent enough that the target path is not defensible

## Handoff

If the topic already exists, hand off the existing article path to enhancement, audit, or SVG work.

If the topic does not exist, hand off:

- canonical domain
- canonical category
- canonical sub-category
- canonical topic
- expected file path
- likely sibling article paths for style reference

## Guardrails

- Do not create or edit content.
- Do not assume a topic belongs to a sub-category unless it is supported by the hierarchy data.
- Prefer exact repo names over conversational paraphrases once resolved.
- Call out ambiguity early if a topic name appears similar to multiple entries.

## Reference

- For repo-specific path and naming guidance, read `references/repo-paths.md`.
