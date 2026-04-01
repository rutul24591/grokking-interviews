function highlightTerms(title, queryTerms) {
  return title
    .split(' ')
    .map((word) => (queryTerms.includes(word.toLowerCase()) ? '[' + word + ']' : word))
    .join(' ');
}
console.log(highlightTerms('Search Ranking Design', ['search', 'ranking']));
