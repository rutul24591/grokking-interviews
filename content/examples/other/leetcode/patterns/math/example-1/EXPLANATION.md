Example 1 is a production-style implementation demo for this Leetcode pattern.

Implements Euclid’s algorithm for gcd and derives lcm — common math primitives used in many Leetcode problems.

It demonstrates:
- gcd handles negatives via abs()
- lcm uses gcd to avoid overflow patterns where possible
- gcd(a,0)=|a| behavior is correct
