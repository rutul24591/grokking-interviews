function evaluateUploadBatch({ files, maxFiles, maxSizeMb, acceptedExtensions }) {
  return {
    accepted: files.slice(0, maxFiles).map((file) => {
      const ext = file.name.split(".").pop();
      return {
        file: file.name,
        accepted: file.sizeMb <= maxSizeMb && acceptedExtensions.includes(ext),
        reason: file.sizeMb > maxSizeMb ? "file-too-large" : acceptedExtensions.includes(ext) ? "accepted" : "unsupported-type"
      };
    }),
    droppedBecauseOfBatchLimit: Math.max(0, files.length - maxFiles)
  };
}

console.log(evaluateUploadBatch({
  files: [
    { name: "design.pdf", sizeMb: 12 },
    { name: "dump.mov", sizeMb: 55 },
    { name: "diagram.svg", sizeMb: 3 },
    { name: "archive.zip", sizeMb: 21 },
    { name: "extra.png", sizeMb: 4 },
    { name: "overflow.csv", sizeMb: 2 }
  ],
  maxFiles: 5,
  maxSizeMb: 50,
  acceptedExtensions: ["pdf", "png", "svg", "zip"]
}));
