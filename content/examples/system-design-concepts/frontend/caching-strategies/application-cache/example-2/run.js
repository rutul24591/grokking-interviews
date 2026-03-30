const files = [
  '<html manifest="app.appcache"></html>',
  '<html></html>',
  `CACHE MANIFEST
/index.html
`
];

console.log(
  files.map((content, index) => ({
    file: `legacy-${index + 1}`,
    hasManifestAttr: content.includes('manifest="'),
    hasAppCacheManifest: content.startsWith('CACHE MANIFEST')
  }))
);
