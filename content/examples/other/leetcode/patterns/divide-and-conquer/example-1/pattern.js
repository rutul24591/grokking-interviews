function maxCrossingSum(arr, left, mid, right) {
  let sum = 0;
  let leftSum = -Infinity;
  for (let i = mid; i >= left; i -= 1) {
    sum += arr[i];
    leftSum = Math.max(leftSum, sum);
  }
  sum = 0;
  let rightSum = -Infinity;
  for (let i = mid + 1; i <= right; i += 1) {
    sum += arr[i];
    rightSum = Math.max(rightSum, sum);
  }
  return leftSum + rightSum;
}

function maxSubarray(arr, left = 0, right = arr.length - 1) {
  if (arr.length === 0) return null;
  if (left === right) return arr[left];
  const mid = Math.floor((left + right) / 2);
  return Math.max(
    maxSubarray(arr, left, mid),
    maxSubarray(arr, mid + 1, right),
    maxCrossingSum(arr, left, mid, right),
  );
}

module.exports = { maxSubarray };
