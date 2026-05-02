Example 3 focuses on edge cases and correctness checks you should validate.

Covers empty text, pattern longer than text, and non-ASCII characters.

It demonstrates:
- pattern longer than text returns -1
- empty text returns -1 unless pattern is empty
- Unicode strings still behave deterministically under code unit comparisons
