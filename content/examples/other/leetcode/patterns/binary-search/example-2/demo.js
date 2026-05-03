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

const arr = [1,2,2,2,5,9];
console.log("lb(2):", lowerBound(arr, 2));
console.log("lb(4):", lowerBound(arr, 4));
