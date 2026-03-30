const cache = [
  { url: '/articles/a', surrogateKeys: ['articles', 'article-a'] },
  { url: '/articles/b', surrogateKeys: ['articles', 'article-b'] }
];
const purged = cache.filter((entry) => !entry.surrogateKeys.includes('article-a'));
console.log({ before: cache, afterPurge: purged });
