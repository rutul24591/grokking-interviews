const diagnoses = [
  ["layout thrash", "Repeated reads and writes force sync layout"],
  ["large paint area", "Animating shadows or large surfaces increases paint cost"],
  ["too much JS", "Frame misses happen before the browser can paint"],
];
console.log("Jank diagnosis\n");
for (const [name, note] of diagnoses) console.log(`- ${name}: ${note}`);
