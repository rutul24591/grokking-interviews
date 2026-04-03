type BreakpointCase = { width: number; hasSidebar: boolean; cardsPerRow: number };

function detectLayoutStress(input: BreakpointCase) {
  const overcrowded = input.width < 768 && (input.hasSidebar || input.cardsPerRow > 1);
  return {
    width: input.width,
    overcrowded,
    action: overcrowded ? 'collapse-secondary-ui' : 'keep-layout',
  };
}

const results = [
  { width: 1440, hasSidebar: true, cardsPerRow: 3 },
  { width: 375, hasSidebar: true, cardsPerRow: 2 },
].map(detectLayoutStress);

console.table(results);
if (results[1].action !== 'collapse-secondary-ui') throw new Error('Mobile layout should collapse secondary UI');
