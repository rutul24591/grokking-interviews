const waits = [200, 1200, 5000];
console.log(waits.map((ms) => ({ ms, ui: ms < 400 ? 'none-or-subtle' : ms < 2000 ? 'skeleton' : 'progress-and-context' })));
