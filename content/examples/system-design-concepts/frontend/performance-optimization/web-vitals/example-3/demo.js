const fixes = [
  { issue: "images without dimensions", fix: "reserve width/height or aspect-ratio" },
  { issue: "long main-thread tasks", fix: "split work or yield to the browser" },
  { issue: "font swap shift", fix: "preload fonts and tune fallback metrics" },
];
for (const row of fixes) {
  console.log(`${row.issue} -> ${row.fix}`);
}
