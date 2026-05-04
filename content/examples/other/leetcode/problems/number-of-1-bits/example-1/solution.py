def hamming_weight_scan(n):
    n &= 0xFFFFFFFF
    count = 0
    for i in range(32):
        count += (n >> i) & 1
    return count


if __name__ == "__main__":
    print(hamming_weight_scan(0b00000000000000000000000000001011))
