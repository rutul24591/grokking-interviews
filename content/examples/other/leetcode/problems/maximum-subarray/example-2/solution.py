def max_sub_array(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best

if __name__ == '__main__':
    print(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))
