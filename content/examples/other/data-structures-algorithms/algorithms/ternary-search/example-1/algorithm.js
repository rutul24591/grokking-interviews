function ternarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const third = Math.floor((high - low) / 3);
    const mid1 = low + third;
    const mid2 = high - third;
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    if (target < arr[mid1]) high = mid1 - 1;
    else if (target > arr[mid2]) low = mid2 + 1;
    else {
      low = mid1 + 1;
      high = mid2 - 1;
    }
  }
  return -1;
}

module.exports = { ternarySearch };
