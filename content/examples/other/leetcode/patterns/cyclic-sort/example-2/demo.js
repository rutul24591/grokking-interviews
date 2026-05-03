function findDuplicates(nums) {
  const arr = [...nums];
  let i = 0;
  while (i < arr.length) {
    const correct = arr[i] - 1;
    if (arr[i] !== arr[correct]) [arr[i], arr[correct]] = [arr[correct], arr[i]];
    else i += 1;
  }
  const dupes = [];
  for (let idx = 0; idx < arr.length; idx += 1) {
    if (arr[idx] !== idx + 1) dupes.push(arr[idx]);
  }
  return [...new Set(dupes)];
}

console.log(findDuplicates([4,3,2,7,8,2,3,1]));
