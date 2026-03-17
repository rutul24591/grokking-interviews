# File System Access API Examples

## Example 1: Open and Read a File

```javascript
async function openTextFile() {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'Text Files',
        accept: { 'text/plain': ['.txt', '.md'] },
      }],
      multiple: false,
    });

    const file = await fileHandle.getFile();
    const contents = await file.text();
    return { name: file.name, contents, handle: fileHandle };
  } catch (err) {
    if (err.name === 'AbortError') return null; // User cancelled
    throw err;
  }
}
```

## Example 2: Save a File

```javascript
async function saveTextFile(contents, existingHandle = null) {
  const handle = existingHandle || await window.showSaveFilePicker({
    suggestedName: 'document.txt',
    types: [{
      description: 'Text File',
      accept: { 'text/plain': ['.txt'] },
    }],
  });

  const writable = await handle.createWritable();
  await writable.write(contents);
  await writable.close();
  return handle;
}

// Usage: Save / Save As pattern
let currentHandle = null;

async function save(contents) {
  currentHandle = await saveTextFile(contents, currentHandle);
}

async function saveAs(contents) {
  currentHandle = await saveTextFile(contents, null);
}
```

## Example 3: Directory Access

```javascript
async function openProject() {
  const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });

  // List all files
  const files = [];
  for await (const [name, handle] of dirHandle) {
    if (handle.kind === 'file') {
      files.push({ name, handle });
    } else if (handle.kind === 'directory') {
      // Recursively process subdirectories
      files.push({ name, handle, isDir: true });
    }
  }

  return { dirHandle, files };
}

// Create a new file in directory
async function createFileInDir(dirHandle, filename, contents) {
  const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
  return fileHandle;
}
```

## Example 4: Origin Private File System (OPFS)

```javascript
// OPFS - no user prompt, sandboxed, high performance
async function useOPFS() {
  const root = await navigator.storage.getDirectory();

  // Create/open a file
  const fileHandle = await root.getFileHandle('data.json', { create: true });

  // Write
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify({ key: 'value' }));
  await writable.close();

  // Read
  const file = await fileHandle.getFile();
  const data = JSON.parse(await file.text());

  // Create subdirectory
  const subDir = await root.getDirectoryHandle('cache', { create: true });
  const cached = await subDir.getFileHandle('response.bin', { create: true });

  return data;
}

// Synchronous access in Web Worker (high performance)
// worker.js
async function syncOPFS() {
  const root = await navigator.storage.getDirectory();
  const handle = await root.getFileHandle('db.sqlite', { create: true });
  const accessHandle = await handle.createSyncAccessHandle();

  // Synchronous read/write (fast, no promises)
  const buffer = new ArrayBuffer(1024);
  const bytesRead = accessHandle.read(buffer, { at: 0 });
  accessHandle.write(new Uint8Array([1, 2, 3]), { at: 0 });
  accessHandle.flush();
  accessHandle.close();
}
```
