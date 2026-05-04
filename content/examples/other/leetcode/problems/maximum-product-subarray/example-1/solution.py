def max_product_brute(nums):
    best = float("-inf")
    for i in range(len(nums)):
        product = 1
        for j in range(i, len(nums)):
            product *= nums[j]
            if product > best:
                best = product
    return best


if __name__ == "__main__":
    print(max_product_brute([2, 3, -2, 4]))
