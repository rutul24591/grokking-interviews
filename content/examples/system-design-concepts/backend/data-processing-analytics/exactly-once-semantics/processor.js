const processed = new Set();

function handle(evt) {
  if (processed.has(evt.id)) return;
  processed.add(evt.id);
  console.log('process', evt.id);
}

module.exports = { handle };