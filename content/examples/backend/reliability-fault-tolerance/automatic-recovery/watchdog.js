const { spawn } = require('child_process');
let restarts = 0;

function start() {
  const proc = spawn('node', ['worker.js']);
  proc.on('exit', () => {
    restarts += 1;
    if (restarts <= 5) setTimeout(start, 10000);
  });
}

start();