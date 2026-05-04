def max_profit(prices):
    best = 0
    for i in range(len(prices)):
        for j in range(i+1, len(prices)):
            best = max(best, prices[j] - prices[i])
    return best

if __name__ == '__main__':
    print(max_profit([7,1,5,3,6,4]))
