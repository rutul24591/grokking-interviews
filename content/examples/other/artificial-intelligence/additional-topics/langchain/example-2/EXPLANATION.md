# LangChain Agent with Tools

## How to Run

```bash
python demo.py
```

For full functionality (not required for simulated output):
```bash
pip install langgraph langchain-openai
```

## What This Demonstrates

This example demonstrates building an AI agent that can use external tools to answer user queries. It defines three custom tools (calculator, word counter, weather lookup), wraps them with the `@tool` decorator, and runs them through a ReAct (Reasoning + Acting) agent loop that selects and calls tools based on user input.

## Code Walkthrough

### Tool Definitions

Three tools are defined using the `@tool` decorator, which automatically extracts the tool name and description from the function signature and docstring:

1. **`calculator(expression: str)`**: Evaluates a mathematical expression using Python's `eval()` with a restricted globals dictionary (no builtins) for safety. Returns the result as a string.
2. **`word_counter(text: str)`**: Counts the number of words in a text by splitting on whitespace. Returns a formatted count string.
3. **`get_weather(city: str)`**: Looks up weather data from a simulated dictionary for four cities (London, New York, Tokyo, Paris). Returns a formatted weather string.

### Execution Flow

1. The script checks if `langgraph` is installed. If not, it prints a simulated interaction showing:
   - The three defined tools with their signatures.
   - An example user query: "What is 15 * 23 and how many words are in this sentence?"
   - The agent's reasoning process: identifies it needs `calculator` and `word_counter`, calls each tool, and synthesizes the results.
2. With langgraph installed:
   - Tools are collected into a list and passed to `create_react_agent()` along with a `ChatOpenAI` model (GPT-4).
   - The agent is invoked with a user message: "What's the weather in London and what is 25 * 4?"
   - The ReAct loop: the agent reasons about which tools to use, calls them sequentially, observes the results, and generates a final response combining the weather and calculation results.

### Important Variables

- `@tool` decorator: The mechanism for defining tools with automatic name/description extraction from function metadata.
- `create_react_agent(model, tools)`: Creates a ReAct agent that interleaves LLM reasoning with tool execution.
- `eval(expression, {"__builtins__": {}}, {})`: Restricted eval that prevents access to Python builtins, reducing security risks.

## Key Takeaways

- The ReAct agent pattern enables AI systems to use external tools by interleaving reasoning (what tool do I need?) with acting (calling the tool and observing results).
- The `@tool` decorator makes tool definition simple and self-documenting -- the function name, signature, and docstring are all used by the agent for tool selection.
- Tool results are fed back into the agent's context as observations, allowing the agent to chain multiple tool calls before producing a final answer.
- The agent continues the reasoning-acting loop until it has enough information to answer the user's query fully.
- Production agent systems extend this pattern with tool error handling, rate limiting, tool selection confidence scores, and guardrails to prevent inappropriate tool usage.
