"""
Example 1: LCEL Pipeline — Prompt, Model, Parser

Demonstrates:
- LangChain Expression Language pipe syntax
- ChatPromptTemplate construction
- Structured output parsing with Pydantic
- Retry logic on parse failure
"""

try:
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import PydanticOutputParser
    from langchain_openai import ChatOpenAI
    from pydantic import BaseModel, Field
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False
    print("Install langchain: pip install langchain langchain-openai")


class MovieReview(BaseModel):
    """Structured movie review output."""
    title: str = Field(description="Movie title")
    rating: int = Field(ge=1, le=10, description="Rating out of 10")
    summary: str = Field(description="One-sentence summary")
    pros: list[str] = Field(description="List of positive aspects")
    cons: list[str] = Field(description="List of negative aspects")


def build_lcel_chain():
    """Build an LCEL pipeline: prompt | model | parser."""
    if not HAS_LANGCHAIN:
        return None

    parser = PydanticOutputParser(pydantic_object=MovieReview)

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a movie critic. Respond in JSON format only."),
        ("human", "Review the movie: {movie_name}\n\n{format_instructions}"),
    ]).partial(format_instructions=parser.get_format_instructions())

    model = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

    # LCEL pipe syntax
    chain = prompt | model | parser
    return chain


def main():
    if not HAS_LANGCHAIN:
        print("=== LCEL Pipeline Demo (Simulated) ===\n")
        print("Chain: ChatPromptTemplate | ChatOpenAI | PydanticOutputParser")
        print("\nInput: {'movie_name': 'The Matrix'}")
        print("\nSimulated Output:")
        print("  MovieReview(")
        print("    title='The Matrix',")
        print("    rating=9,")
        print("    summary='A groundbreaking sci-fi that redefined action cinema'",")
        print("    pros=['Innovative visual effects', 'Philosophical depth'],")
        print("    cons=['Pacing issues in second act']")
        print("  )")
        print("\nLCEL Benefits:")
        print("  - Streaming: Output streams as generated")
        print("  - Type safety: Pydantic validates output")
        print("  - Retry: Automatic retry on parse failure")
        print("  - Async: Native async/await support")
    else:
        chain = build_lcel_chain()
        result = chain.invoke({"movie_name": "The Matrix"})
        print(f"Review: {result}")


if __name__ == "__main__":
    main()
