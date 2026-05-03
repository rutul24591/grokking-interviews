function kadane(arr) {
  if (arr.length === 0) return null;
  let best = arr[0];
  let current = arr[0];
  for (let i = 1; i < arr.length; i += 1) {
    current = Math.max(arr[i], current + arr[i]);
    best = Math.max(best, current);
  }
  return best;
}
console.log(kadane([-2,1,-3,4,-1,2,1,-5,4]));
