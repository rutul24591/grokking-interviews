function canRenderPage({ published, missingAssets, viewerRole }) {
  return {
    renderable: published && missingAssets.length === 0,
    reviewerBypass: viewerRole === "editor" && missingAssets.length > 0,
    reason: !published ? "not-published" : missingAssets.length > 0 ? "assets-missing" : "renderable"
  };
}

console.log(canRenderPage({ published: true, missingAssets: ["hero.png"], viewerRole: "editor" }));
