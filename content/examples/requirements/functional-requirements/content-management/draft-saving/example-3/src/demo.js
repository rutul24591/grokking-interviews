function staleWritePolicy(localVersion, serverVersion) {
  return {
    conflict: localVersion < serverVersion,
    nextAction: localVersion < serverVersion ? "prompt-merge" : "accept-save"
  };
}

console.log(staleWritePolicy(14, 15));
