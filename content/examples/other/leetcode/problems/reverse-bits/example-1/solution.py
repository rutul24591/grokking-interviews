def reverse_bits_scan(n):
    n &= 0xFFFFFFFF
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result & 0xFFFFFFFF


if __name__ == "__main__":
    print(reverse_bits_scan(0b00000010100101000001111010011100))
