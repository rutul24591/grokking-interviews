const assets = [
  { name: "hero.avif", bytes: 182000, role: "hero", lcpCandidate: true },
  { name: "secondary-banner.avif", bytes: 164000, role: "supporting", lcpCandidate: false },
  { name: "author-avatar.png", bytes: 34000, role: "avatar", lcpCandidate: false },
  { name: "diagram.svg", bytes: 14000, role: "diagram", lcpCandidate: false },
];

const preloadBudgetBytes = 220000;
let usedBudget = 0;

for (const asset of assets) {
  const wantsPreload = asset.lcpCandidate;
  const preload = wantsPreload && usedBudget + asset.bytes <= preloadBudgetBytes;
  if (preload) usedBudget += asset.bytes;

  const placeholder = asset.role !== "diagram";
  console.log(
    `${asset.name} -> preload:${preload} placeholder:${placeholder} remainingBudget:${preloadBudgetBytes - usedBudget}`,
  );
}
