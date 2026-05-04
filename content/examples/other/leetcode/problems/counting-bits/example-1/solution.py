def count_bits_naive(n):
    out = [0] * (n + 1)
    for i in range(n + 1):
        x = i
        count = 0
        for b in range(32):
            count += (x >> b) & 1
        out[i] = count
    return out


if __name__ == "__main__":
    print(count_bits_naive(5))
