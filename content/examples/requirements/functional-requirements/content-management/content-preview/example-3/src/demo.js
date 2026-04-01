function socialPreviewFallback({ socialEnabled, ogImagePresent, fallbackAsset }) {
  return {
    degraded: socialEnabled && !ogImagePresent,
    action: socialEnabled && !ogImagePresent ? `use-fallback:${fallbackAsset}` : "publish-normal"
  };
}

console.log(socialPreviewFallback({ socialEnabled: true, ogImagePresent: false, fallbackAsset: "default-og.png" }));
