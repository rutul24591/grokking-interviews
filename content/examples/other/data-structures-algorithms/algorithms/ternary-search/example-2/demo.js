function lowerBound(arr, target) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] < target) low = mid + 1;
    else high = mid;
  }
  return low;
}

function upperBound(arr, target) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] <= target) low = mid + 1;
    else high = mid;
  }
  return low;
}

const values = [1, 2, 2, 2, 5, 9];
console.log("lowerBound(2):", lowerBound(values, 2));
console.log("upperBound(2):", upperBound(values, 2));
console.log("insertion point for 4:", lowerBound(values, 4));
