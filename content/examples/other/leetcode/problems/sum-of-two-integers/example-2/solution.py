def get_sum(a, b):
    mask = 0xFFFFFFFF
    a &= mask
    b &= mask
    while b != 0:
        carry = ((a & b) << 1) & mask
        a = (a ^ b) & mask
        b = carry
    if a > 0x7FFFFFFF:
        a = ~ (a ^ mask)
    return a


if __name__ == "__main__":
    print(get_sum(1, 2))
    print(get_sum(-4, 7))
