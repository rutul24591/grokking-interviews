setInterval(() => {
  if (Math.random() < 0.1) {
    process.exit(1);
  }
}, 1000);