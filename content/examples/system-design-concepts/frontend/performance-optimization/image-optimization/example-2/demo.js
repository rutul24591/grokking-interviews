const candidates = [
  { width: 480, file: "card-480.avif" },
  { width: 768, file: "card-768.avif" },
  { width: 1200, file: "card-1200.avif" },
];

function chooseSource(slotWidth) {
  return candidates.find((candidate) => candidate.width >= slotWidth) ?? candidates[candidates.length - 1];
}

for (const slotWidth of [360, 640, 980, 1440]) {
  const choice = chooseSource(slotWidth);
  console.log(`${slotWidth}px slot -> ${choice.file}`);
}
