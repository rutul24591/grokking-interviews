function removeDuplicates(arr) {
  if (arr.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < arr.length; read += 1) {
    if (arr[read] !== arr[read - 1]) arr[write++] = arr[read];
  }
  return write;
}

const arr = [2, 3, 3, 3, 6, 9, 9];
const len = removeDuplicates(arr);
console.log(len, arr.slice(0, len));
