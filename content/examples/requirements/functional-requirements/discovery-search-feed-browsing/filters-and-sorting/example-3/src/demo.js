function sortFallback(mode, availableModes) {
  return availableModes.includes(mode) ? mode : availableModes[0];
}
console.log(sortFallback('recent', ['popular', 'recent']));
console.log(sortFallback('editorial', ['popular', 'recent']));
