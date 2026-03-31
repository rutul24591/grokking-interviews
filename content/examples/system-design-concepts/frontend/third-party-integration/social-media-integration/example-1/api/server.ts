import express from "express";

const app = express();

app.get("/share", (req, res) => {
  const provider = String(req.query.provider || "linkedin");
  const slug = String(req.query.slug || "article");
  const canonicalUrl = `https://systemdesign.example.com/articles/${slug}`;
  const shareBase = {
    linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=",
    x: "https://x.com/intent/post?url=",
    facebook: "https://www.facebook.com/sharer/sharer.php?u="
  } as const;

  res.json({
    provider,
    shareUrl: `${shareBase[provider as keyof typeof shareBase] ?? shareBase.linkedin}${encodeURIComponent(canonicalUrl)}`,
    previewTitle: `Deep dive: ${slug.replace(/-/g, " ")}`,
    previewDescription: "Production trade-offs, interview framing, and implementation patterns."
  });
});

app.listen(Number(process.env.PORT || 4476), () => {
  console.log("Social media integration API on http://localhost:4476");
});
