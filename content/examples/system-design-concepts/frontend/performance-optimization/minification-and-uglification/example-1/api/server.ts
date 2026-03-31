import express from "express";
import { gzipSync } from "node:zlib";
import { transform } from "esbuild";

const app = express();

const bundles = [
  {
    name: "app.js",
    loader: "js",
    sourceMapMode: "hidden-source-map",
    originalSource: `function formatCurrency(amount, currency) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });

  return formatter.format(amount);
}`,
  },
  {
    name: "vendors.js",
    loader: "js",
    sourceMapMode: "hidden-source-map",
    originalSource: `function expensiveLogger(value) {
  console.log("debug", value);
  return value.items.map((item) => item.price).reduce((sum, price) => sum + price, 0);
}`,
  },
  {
    name: "styles.css",
    loader: "css",
    sourceMapMode: "external",
    originalSource: `.card {
  padding: 16px 24px;
  margin: 0 auto;
  color: #1f2937;
}`,
  },
];

async function minifyBundle(bundle: (typeof bundles)[number]) {
  const result = await transform(bundle.originalSource, {
    loader: bundle.loader,
    minify: true,
    sourcemap: bundle.sourceMapMode === "hidden-source-map" ? "external" : false,
    target: "es2020",
    legalComments: "none",
  });

  const minifiedSource = result.code.trim();

  return {
    name: bundle.name,
    sourceMapMode: bundle.sourceMapMode,
    originalSource: bundle.originalSource,
    minifiedSource,
    originalBytes: Buffer.byteLength(bundle.originalSource),
    minifiedBytes: Buffer.byteLength(minifiedSource),
    gzipBytes: gzipSync(minifiedSource).byteLength,
  };
}

app.get("/assets", async (_req, res) => {
  const assets = await Promise.all(bundles.map((bundle) => minifyBundle(bundle)));
  res.json(
    assets.map(({ name, originalBytes, minifiedBytes, gzipBytes, sourceMapMode }) => ({
      name,
      originalBytes,
      minifiedBytes,
      gzipBytes,
      sourceMapMode,
    })),
  );
});

app.get("/bundle-preview", async (req, res) => {
  const name = String(req.query.name || "app.js");
  const bundle = bundles.find((entry) => entry.name === name) ?? bundles[0];
  res.json(await minifyBundle(bundle));
});

const port = Number(process.env.PORT || 4190);
app.listen(port, () => {
  console.log(`Minification API on http://localhost:${port}`);
});
