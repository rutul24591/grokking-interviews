def product_except_self(nums):
    out = []
    for i in range(len(nums)):
        prod = 1
        for j in range(len(nums)):
            if i == j:
                continue
            prod *= nums[j]
        out.append(prod)
    return out

if __name__ == '__main__':
    print(product_except_self([1,2,3,4]))
