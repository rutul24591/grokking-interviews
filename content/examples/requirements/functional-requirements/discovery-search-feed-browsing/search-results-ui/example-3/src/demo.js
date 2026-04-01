function snippetCoverage(results) {
  return results.every((result) => result.excerpt && result.excerpt.trim().length > 0);
}
console.log(snippetCoverage([{ excerpt: 'ok' }, { excerpt: '' }]));
