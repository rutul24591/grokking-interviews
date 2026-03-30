function chooseMode(supportsFileSystemAccess) {
  return supportsFileSystemAccess ? "native-file-handle" : "upload-download-fallback";
}

console.log("chromium:", chooseMode(true));
console.log("safari:", chooseMode(false));

