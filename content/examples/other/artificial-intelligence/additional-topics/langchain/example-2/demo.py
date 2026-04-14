"""
Example 2: LangChain Agent with Tools

Demonstrates:
- Creating custom tools
- ReAct agent loop
- Tool selection and execution
- Error handling in agent loop
"""

try:
    from langchain_core.tools import tool
    from langchain_openai import ChatOpenAI
    from langgraph.prebuilt import create_react_agent
    HAS_LANGGRAPH = True
except ImportError:
    HAS_LANGGRAPH = False
    print("Install langgraph: pip install langgraph langchain-openai")


# Define custom tools
@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression."""
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception as e:
        return f"Error: {e}"


@tool
def word_counter(text: str) -> str:
    """Count the number of words in a text."""
    return f"Word count: {len(text.split())}"


@tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    # Simulated weather data
    weather_db = {
        "london": "15°C, Cloudy",
        "new york": "22°C, Sunny",
        "tokyo": "28°C, Humid",
        "paris": "18°C, Partly cloudy",
    }
    return weather_db.get(city.lower(), f"Weather data unavailable for {city}")


def main():
    if not HAS_LANGGRAPH:
        print("=== LangChain Agent with Tools (Simulated) ===\n")
        print("Tools defined:")
        print("  calculator(expression: str) -> str")
        print("  word_counter(text: str) -> str")
        print("  get_weather(city: str) -> str")
        print("\nAgent Type: ReAct (Reasoning + Acting)")
        print("\nExample interaction:")
        print("  User: 'What is 15 * 23 and how many words are in this sentence?'")
        print("  Agent thinks: I need to use calculator and word_counter")
        print("  Agent calls: calculator('15 * 23') → '345'")
        print("  Agent calls: word_counter('how many words are in this sentence') → 'Word count: 9'")
        print("  Agent responds: '15 * 23 = 345, and the sentence has 9 words.'")
        print("\nKey patterns:")
        print("  - @tool decorator defines tools with docstring descriptions")
        print("  - Agent selects tools based on descriptions")
        print("  - Tool results fed back as observations")
        print("  - Loop continues until agent has enough information")
    else:
        tools = [calculator, word_counter, get_weather]
        model = ChatOpenAI(model="gpt-4", temperature=0)
        agent = create_react_agent(model, tools)

        # Invoke agent
        result = agent.invoke({
            "messages": [("human", "What's the weather in London and what is 25 * 4?")]
        })
        print(f"Agent response: {result['messages'][-1].content}")


if __name__ == "__main__":
    main()
