Example 3 covers the edge case where compression is a bad trade.

The script implements a simple compression policy that skips already-compressed media and tiny payloads, which is
the practical rule most systems apply before spending CPU on encoding.
