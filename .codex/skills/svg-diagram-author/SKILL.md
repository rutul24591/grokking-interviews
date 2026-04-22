---
name: svg-diagram-author
description: Create 3-5 valid SVG diagrams for articles in this system-design-prep repository. Use when a system design article needs interview-friendly architecture, scaling, failover, consistency, or performance trade-off diagrams that follow the SVG constraints in AGENTS.md and avoid broken XML or CSS variable issues.
---

# SVG Diagram Author

Create article diagrams that are minimal, memorable, and valid across common viewers.

## When to Apply

Apply this skill when an article needs fresh SVGs, when diagrams are missing, or when existing diagrams are too generic, broken, or inconsistent with the article's argument.

## Required Reads

- `AGENTS.md`
- `references/svg-rules.md`
- The target article draft or outline

If the article already exists, inspect how `<ArticleImage />` references assets before changing filenames.

## Suggested Execution Order

1. Read the article or outline and identify the 3-5 most teachable visual ideas.
2. Map each visual to one allowed diagram type.
3. Choose deterministic filenames tied to the article slug.
4. Author SVGs with explicit colors and valid XML.
5. Re-open the files as plain text and scan for broken entities, malformed attributes, and accidental CSS variable usage.

## Output Contract

Produce exactly 3-5 SVG files for the target article.

Each SVG must:

- Explain one idea only
- Be interview-friendly and easy to scan
- Use valid XML with escaped special characters
- Avoid CSS custom properties
- Use explicit fill and stroke values
- Work on both light and dark page contexts

## Diagram Types

Choose from:

- Architecture
- Scaling strategies
- Failover or availability architecture
- Consistency models
- Performance trade-offs

Avoid redundant diagrams that restate the same concept with minor visual changes.

## Style Rules

- Prefer transparent canvas with explicit white or light panels and dark text for readability.
- Use bold text only for titles or major labels.
- Keep supporting labels at normal weight.
- Limit the number of shapes so the diagram can be understood quickly in interview prep.
- Keep spatial layout clean enough that the same diagram still works when the article is viewed quickly on a laptop.
- Use arrows, grouping, and labels to clarify flow rather than decorative visual noise.

## File Rules

- Use deterministic filenames tied to the article slug.
- Keep diagrams in the location expected by the article.
- If revising an existing SVG, preserve path compatibility unless the caller explicitly wants renames.

## Diagram Selection Heuristics

- Use an architecture diagram when the article explains component responsibilities or request flow.
- Use a scaling diagram when the main learning is horizontal partitioning, fan-out, caching, or bottleneck movement.
- Use a failover diagram when resilience depends on redundancy, leadership, or traffic rerouting.
- Use a consistency diagram when the article explains replication lag, ordering, quorum, or conflict resolution.
- Use a performance trade-off diagram when latency, throughput, cost, or complexity must be compared visually.

## Guardrails

- Do not use Mermaid.
- Do not use malformed XML entities.
- Do not use CSS variable syntax inside SVGs.
- Do not create placeholder graphics with generic boxes that add no explanatory value.
- Do not add visual clutter just to reach 3-5 files. If the article only supports 3 strong diagrams, stop at 3.

## Reference

- Read `references/svg-rules.md` before authoring or revising diagrams.
