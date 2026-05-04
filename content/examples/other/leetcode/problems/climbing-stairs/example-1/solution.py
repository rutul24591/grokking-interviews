def climb_stairs_naive(n):
    if n <= 2:
        return n
    return climb_stairs_naive(n - 1) + climb_stairs_naive(n - 2)


if __name__ == "__main__":
    print(climb_stairs_naive(5))
