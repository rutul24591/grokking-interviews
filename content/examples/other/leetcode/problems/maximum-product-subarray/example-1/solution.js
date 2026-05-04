function maxProductBrute(nums) {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i += 1) {
    let product = 1;
    for (let j = i; j < nums.length; j += 1) {
      product *= nums[j];
      if (product > best) best = product;
    }
  }
  return best;
}

if (require.main === module) {
  console.log(maxProductBrute([2, 3, -2, 4]));
}

module.exports = { maxProductBrute };
