def max_profit(prices):
    min_so_far = float('inf')
    best = 0
    for p in prices:
        min_so_far = min(min_so_far, p)
        best = max(best, p - min_so_far)
    return best

if __name__ == '__main__':
    print(max_profit([7,1,5,3,6,4]))
