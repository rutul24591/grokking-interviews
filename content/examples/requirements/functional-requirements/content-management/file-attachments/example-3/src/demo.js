function attachmentReleaseGate(files) {
  const blocked = files.filter((file) => file.scanResult !== "clean" || file.status === "rejected");
  return {
    releaseBlocked: blocked.length > 0,
    blockedFiles: blocked.map((file) => file.name)
  };
}

console.log(attachmentReleaseGate([{ name: "retention-policy.pdf", scanResult: "clean", status: "uploaded" }, { name: "oversize.zip", scanResult: "failed", status: "rejected" }]));
