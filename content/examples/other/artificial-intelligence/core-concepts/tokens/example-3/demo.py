"""
Example 3: Token Count Validator — Context Window Management

Demonstrates:
- Accurate token counting before sending requests
- Context window budgeting across input + output
- Truncation strategies when prompt exceeds limits
- Token budget enforcement at the application level
"""

try:
    import tiktoken
except ImportError:
    print("Install tiktoken: pip install tiktoken")
    exit(1)


class TokenBudget:
    """Manages token budgets for LLM requests."""

    def __init__(self, context_window: int, model: str = "gpt-4o"):
        self.context_window = context_window
        self.model = model
        self.enc = tiktoken.encoding_for_model("gpt-4o")

    def count_tokens(self, text: str) -> int:
        """Count tokens in text using the model's exact tokenizer."""
        return len(self.enc.encode(text))

    def build_prompt(
        self,
        system_prompt: str,
        context: str,
        user_input: str,
        max_output_tokens: int = 1000,
        few_shot_examples: list[str] | None = None,
    ) -> dict:
        """
        Build a prompt with token budgeting.
        Returns the constructed prompt or raises if it exceeds limits.
        """
        # Budget: context_window - max_output_tokens = available for input
        available_tokens = self.context_window - max_output_tokens

        # Count fixed components
        system_tokens = self.count_tokens(system_prompt)
        user_tokens = self.count_tokens(user_input)
        fixed_tokens = system_tokens + user_tokens

        # Count few-shot examples if provided
        examples_tokens = 0
        if few_shot_examples:
            for example in few_shot_examples:
                examples_tokens += self.count_tokens(example)

        # Calculate remaining budget for context
        remaining = available_tokens - fixed_tokens - examples_tokens

        if remaining < 0:
            raise ValueError(
                f"Fixed components exceed available budget: "
                f"{fixed_tokens + examples_tokens} > {available_tokens}"
            )

        # Truncate context if needed
        context_tokens = self.count_tokens(context)
        if context_tokens > remaining:
            # Truncate context to fit budget
            context_tokens_available = remaining
            # Approximate: encode, truncate, decode
            context_encoded = self.enc.encode(context)
            truncated = self.enc.decode(context_encoded[:context_tokens_available])
            context = truncated
            context_tokens = context_tokens_available

        # Assemble final prompt
        prompt_parts = [
            f"<system>{system_prompt}</system>",
        ]
        if few_shot_examples:
            prompt_parts.append("<examples>")
            for ex in few_shot_examples:
                prompt_parts.append(ex)
            prompt_parts.append("</examples>")
        prompt_parts.append(f"<context>{context}</context>")
        prompt_parts.append(f"<user>{user_input}</user>")

        final_prompt = "\n\n".join(prompt_parts)
        total_input_tokens = self.count_tokens(final_prompt)

        return {
            "prompt": final_prompt,
            "token_breakdown": {
                "system": system_tokens,
                "context": context_tokens,
                "examples": examples_tokens,
                "user_input": user_tokens,
                "total_input": total_input_tokens,
                "max_output": max_output_tokens,
                "total": total_input_tokens + max_output_tokens,
                "context_window": self.context_window,
                "utilization": f"{(total_input_tokens + max_output_tokens) / self.context_window * 100:.1f}%",
            },
        }


def main():
    budget = TokenBudget(context_window=128_000)

    # Simulate a RAG-style prompt with lots of context
    system_prompt = """You are a legal document analyzer. Extract key clauses, identify risks, and provide recommendations. Respond in JSON."""

    context = "Full contract text..." * 500  # Simulate a long document

    user_input = "Identify all termination clauses and assess their risk level."

    few_shot_examples = [
        "Input: [Contract A]\nOutput: {clauses: [...], risks: [{type: 'high', description: '...'}]}",
        "Input: [Contract B]\nOutput: {clauses: [...], risks: [{type: 'medium', description: '...'}]}",
    ]

    try:
        result = budget.build_prompt(
            system_prompt=system_prompt,
            context=context,
            user_input=user_input,
            max_output_tokens=2000,
            few_shot_examples=few_shot_examples,
        )

        print("=== Token Budget Report ===")
        for key, value in result["token_breakdown"].items():
            print(f"  {key}: {value}")

    except ValueError as e:
        print(f"Budget exceeded: {e}")


if __name__ == "__main__":
    main()
