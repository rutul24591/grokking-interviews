import { defaultSchema } from "rehype-sanitize";

export const markdownSanitizeSchema = {
  ...defaultSchema,
  // Allow common formatting tags that are safe.
  tagNames: Array.from(
    new Set([
      ...(defaultSchema.tagNames ?? []),
      "h1",
      "h2",
      "h3",
      "hr",
      "kbd",
      "mark"
    ])
  ),
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    a: [...((defaultSchema.attributes as any)?.a ?? []), ["target", "_blank"], ["rel", "noopener noreferrer"]]
  },
  protocols: {
    ...(defaultSchema.protocols ?? {}),
    href: ["http", "https", "mailto", "tel"]
  }
};

