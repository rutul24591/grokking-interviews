def max_sub_array(nums):
    best = float('-inf')
    for i in range(len(nums)):
        s = 0
        for j in range(i, len(nums)):
            s += nums[j]
            best = max(best, s)
    return best

if __name__ == '__main__':
    print(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))
