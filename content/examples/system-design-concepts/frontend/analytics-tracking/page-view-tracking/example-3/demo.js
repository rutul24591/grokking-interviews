function shouldTrack(previousCanonical, nextUrl) {
  const nextCanonical = nextUrl.split("#")[0].replace(/\?.*$/, "");
  return nextCanonical !== previousCanonical;
}

console.log(shouldTrack("/articles/web-vitals", "/articles/web-vitals#comments"));
console.log(shouldTrack("/articles/web-vitals", "/articles/request-batching?tab=article"));
