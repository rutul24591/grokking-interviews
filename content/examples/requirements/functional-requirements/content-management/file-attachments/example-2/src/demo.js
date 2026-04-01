function validateAttachmentBatch(files, maxSizeMb, allowedExtensions) {
  return files.map((file) => {
    const extension = file.name.split(".").pop();
    return {
      name: file.name,
      accepted: file.sizeMb <= maxSizeMb && allowedExtensions.includes(extension),
      reason: file.sizeMb > maxSizeMb ? "size-limit" : allowedExtensions.includes(extension) ? "accepted" : "unsupported-type"
    };
  });
}

console.log(validateAttachmentBatch([{ name: "architecture.svg", sizeMb: 3 }, { name: "capture.exe", sizeMb: 1 }], 10, ["svg", "pdf", "csv"]));
