function ambiguousProviders(matches) {
  return {
    ambiguous: matches.length > 1,
    matches,
  };
}

console.log(ambiguousProviders(['workspace-sso', 'google']));
