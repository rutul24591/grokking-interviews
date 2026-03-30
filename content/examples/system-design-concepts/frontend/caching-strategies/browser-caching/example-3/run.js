const assets = [
  { url: '/app.js', cacheControl: 'public, max-age=31536000, immutable', safe: false },
  { url: '/app.f9e8a1.js', cacheControl: 'public, max-age=31536000, immutable', safe: true }
];
console.table(assets);
