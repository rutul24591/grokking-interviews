function canonicalize(url) {
  return url.split("#")[0].replace(/\?.*$/, "");
}

console.log(canonicalize("/articles/web-vitals?tab=examples"));
console.log(canonicalize("/articles/web-vitals#comments"));
console.log(canonicalize("/articles/web-vitals"));
