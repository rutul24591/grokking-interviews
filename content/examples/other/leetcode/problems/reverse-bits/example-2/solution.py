def reverse_bits(n):
    n &= 0xFFFFFFFF
    n = ((n >> 1) & 0x55555555) | ((n & 0x55555555) << 1)
    n = ((n >> 2) & 0x33333333) | ((n & 0x33333333) << 2)
    n = ((n >> 4) & 0x0F0F0F0F) | ((n & 0x0F0F0F0F) << 4)
    n = ((n >> 8) & 0x00FF00FF) | ((n & 0x00FF00FF) << 8)
    n = (n >> 16) | ((n & 0xFFFF) << 16)
    return n & 0xFFFFFFFF


if __name__ == "__main__":
    print(reverse_bits(0b00000010100101000001111010011100))
