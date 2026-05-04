def contains_duplicate(nums):
    s = set()
    for x in nums:
        if x in s:
            return True
        s.add(x)
    return False

if __name__ == '__main__':
    print(contains_duplicate([1,2,3,1]))
