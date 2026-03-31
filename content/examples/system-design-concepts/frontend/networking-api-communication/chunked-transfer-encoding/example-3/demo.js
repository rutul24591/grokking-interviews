const expectedChunks = 3;
const receivedChunks = 2;
console.log(receivedChunks === expectedChunks ? "complete stream" : "premature stream termination");
