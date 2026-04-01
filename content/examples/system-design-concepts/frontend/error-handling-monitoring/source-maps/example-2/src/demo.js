function resolveFrame(frame, releaseArtifact) {
  if (!releaseArtifact.privateMapUploaded) {
    return { status: "missing-private-map", resolvedFrame: null };
  }

  return {
    status: releaseArtifact.map[frame] ? "resolved" : "unknown-frame",
    resolvedFrame: releaseArtifact.map[frame] ?? null
  };
}

console.log(
  resolveFrame("main.js:1:120", {
    privateMapUploaded: true,
    map: { "main.js:1:120": "app/page.tsx:42" }
  })
);
