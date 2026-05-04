# Form Validation Engine — Follow-up: Async Cancellation & Debounce

Example 2 focuses on the classic follow-up: **async validation races** and **debounced validation**.

Interview pressure points:
- “What happens if the user types quickly and multiple requests are in flight?”
- “How do you avoid validating on every keystroke?”
- “How do you ensure only the latest result wins?”

This example shows a token-based cancellation pattern and a small debounce helper.

