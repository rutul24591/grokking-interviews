def get_sum_bit_by_bit(a, b):
    mask = 0xFFFFFFFF
    a &= mask
    b &= mask
    result = 0
    carry = 0
    for i in range(32):
        abit = (a >> i) & 1
        bbit = (b >> i) & 1
        s = abit ^ bbit ^ carry
        carry = (abit & bbit) | (abit & carry) | (bbit & carry)
        result |= (s << i)
    result &= mask
    if result > 0x7FFFFFFF:
        result = ~ (result ^ mask)
    return result


if __name__ == "__main__":
    print(get_sum_bit_by_bit(1, 2))
    print(get_sum_bit_by_bit(-4, 7))
