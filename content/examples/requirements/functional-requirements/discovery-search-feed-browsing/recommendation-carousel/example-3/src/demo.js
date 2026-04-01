function slotFallback(modules, minInventory) {
  const primary = modules.find((module) => module.inventory >= minInventory);
  return primary ? primary.id : 'safe-default-module';
}
console.log(slotFallback([
  { id: 'hero-personalized', inventory: 1 },
  { id: 'hero-trending', inventory: 4 }
], 3));
