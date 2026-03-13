// scripts/track-bundle-size.js
// Run after each build to record bundle sizes
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function getBundleSizes() {
  const buildDir = path.join(process.cwd(), '.next/static');
  const sizes = {};

  // Measure JS chunks
  const jsFiles = glob.sync('chunks/**/*.js', { cwd: buildDir });
  sizes.totalJS = jsFiles.reduce((sum, file) => {
    return sum + fs.statSync(path.join(buildDir, file)).size;
  }, 0);

  // Measure CSS
  const cssFiles = glob.sync('css/**/*.css', { cwd: buildDir });
  sizes.totalCSS = cssFiles.reduce((sum, file) => {
    return sum + fs.statSync(path.join(buildDir, file)).size;
  }, 0);

  // Record timestamp and git commit
  const { execSync } = require('child_process');
  const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();

  return {
    timestamp: new Date().toISOString(),
    commit,
    totalJS: Math.round(sizes.totalJS / 1024),  // KB
    totalCSS: Math.round(sizes.totalCSS / 1024), // KB
    totalSize: Math.round((sizes.totalJS + sizes.totalCSS) / 1024),
  };
}

// Append to tracking file
const historyFile = 'bundle-history.json';
const history = fs.existsSync(historyFile)
  ? JSON.parse(fs.readFileSync(historyFile, 'utf-8'))
  : [];

history.push(getBundleSizes());
fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
console.log('Bundle size recorded:', history[history.length - 1]);