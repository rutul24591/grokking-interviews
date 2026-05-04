def hamming_weight(n):
    n &= 0xFFFFFFFF
    count = 0
    while n != 0:
        n &= n - 1
        count += 1
    return count


if __name__ == "__main__":
    print(hamming_weight(0b00000000000000000000000000001011))
