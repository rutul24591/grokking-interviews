function shouldCommitResult({ activeRequestId, responseRequestId, mounted }) {
  return mounted && activeRequestId === responseRequestId;
}

console.log(shouldCommitResult({ activeRequestId: 3, responseRequestId: 3, mounted: true }));
console.log(shouldCommitResult({ activeRequestId: 4, responseRequestId: 3, mounted: true }));
console.log(shouldCommitResult({ activeRequestId: 4, responseRequestId: 4, mounted: false }));
