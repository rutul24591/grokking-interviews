import type { Metadata } from "next";
import { z } from "zod";

const InputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  canonicalPath: z.string().startsWith("/"),
  ogImagePath: z.string().startsWith("/")
});

export function buildSocialMetadata(input: z.infer<typeof InputSchema>): Metadata {
  const v = InputSchema.parse(input);
  return {
    title: v.title,
    description: v.description,
    alternates: { canonical: v.canonicalPath },
    openGraph: {
      title: v.title,
      description: v.description,
      url: v.canonicalPath,
      images: [{ url: v.ogImagePath, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title: v.title,
      description: v.description,
      images: [v.ogImagePath]
    }
  };
}

