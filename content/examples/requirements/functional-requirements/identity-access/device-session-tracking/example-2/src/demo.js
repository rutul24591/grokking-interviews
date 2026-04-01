function duplicateFingerprint(existing, candidate) {
  return existing.some((item) => item.fingerprint === candidate.fingerprint);
}

console.log(duplicateFingerprint([{ fingerprint: 'macos-safari' }], { fingerprint: 'macos-safari' }));
console.log(duplicateFingerprint([{ fingerprint: 'macos-safari' }], { fingerprint: 'android-chrome' }));
