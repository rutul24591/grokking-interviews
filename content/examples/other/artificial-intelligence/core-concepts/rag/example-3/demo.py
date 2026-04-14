"""
Example 3: RAG Evaluation with RAGAS-inspired Metrics

Demonstrates:
- Faithfulness: Are answer claims supported by retrieved context?
- Answer Relevance: Does the answer address the query?
- Context Precision: Is retrieved context actually useful?
- Overall RAG quality scoring
"""

from typing import List, Dict, Any
import re


def extract_claims(answer: str) -> List[str]:
    """Extract factual claims from an answer (simplified)."""
    claims = []
    for sentence in re.split(r'[.!?]+', answer):
        sentence = sentence.strip()
        if len(sentence) > 10:
            claims.append(sentence)
    return claims


def check_claim_in_context(claim: str, contexts: List[str]) -> bool:
    """Check if a claim is supported by any context chunk."""
    claim_words = set(claim.lower().split())
    for ctx in contexts:
        ctx_words = set(ctx.lower().split())
        overlap = len(claim_words & ctx_words) / max(len(claim_words), 1)
        if overlap > 0.5:
            return True
    return False


def calculate_faithfulness(answer: str, contexts: List[str]) -> float:
    """Fraction of answer claims supported by retrieved context."""
    claims = extract_claims(answer)
    if not claims:
        return 0.0
    supported = sum(1 for c in claims if check_claim_in_context(c, contexts))
    return supported / len(claims)


def calculate_answer_relevance(query: str, answer: str) -> float:
    """Does the answer address the query? (simplified keyword overlap)."""
    query_words = set(q.lower() for q in re.findall(r'\w+', query) if len(q) > 3)
    answer_words = set(a.lower() for a in re.findall(r'\w+', answer) if len(a) > 3)
    if not query_words:
        return 0.0
    return len(query_words & answer_words) / len(query_words)


def calculate_context_precision(query: str, contexts: List[str]) -> float:
    """Fraction of retrieved contexts that are actually relevant to query."""
    query_words = set(q.lower() for q in re.findall(r'\w+', query) if len(q) > 3)
    if not query_words:
        return 0.0
    relevant = 0
    for ctx in contexts:
        ctx_words = set(c.lower() for c in re.findall(r'\w+', ctx) if len(c) > 3)
        if len(query_words & ctx_words) > 0:
            relevant += 1
    return relevant / len(contexts)


def evaluate_rag(query: str, answer: str, contexts: List[str]) -> Dict[str, Any]:
    """Full RAG evaluation."""
    faithfulness = calculate_faithfulness(answer, contexts)
    relevance = calculate_answer_relevance(query, answer)
    precision = calculate_context_precision(query, contexts)
    overall = (faithfulness * 0.4 + relevance * 0.3 + precision * 0.3)

    return {
        "faithfulness": round(faithfulness, 3),
        "answer_relevance": round(relevance, 3),
        "context_precision": round(precision, 3),
        "overall_score": round(overall, 3),
        "claims_found": sum(1 for c in extract_claims(answer) if check_claim_in_context(c, contexts)),
        "total_claims": len(extract_claims(answer)),
    }


def main():
    query = "What was the company's Q3 revenue and margin?"

    contexts = [
        "Q3 revenue was $4.2 billion, up 15% year-over-year. Operating margin reached 28%.",
        "The cloud division grew 35% and represents 40% of total revenue.",
    ]

    # Good answer (faithful, relevant)
    good_answer = "Q3 revenue was $4.2 billion with 15% YoY growth. Operating margin was 28%."
    result = evaluate_rag(query, good_answer, contexts)
    print("=== Good Answer ===")
    print(f"  Faithfulness: {result['faithfulness']}")
    print(f"  Relevance: {result['answer_relevance']}")
    print(f"  Context Precision: {result['context_precision']}")
    print(f"  Overall: {result['overall_score']}")

    # Hallucinated answer
    bad_answer = "Q3 revenue was $6.8 billion with 50% growth. Operating margin was 45%. The company acquired 3 startups."
    result = evaluate_rag(query, bad_answer, contexts)
    print("\n=== Hallucinated Answer ===")
    print(f"  Faithfulness: {result['faithfulness']} ({result['claims_found']}/{result['total_claims']} claims supported)")
    print(f"  Relevance: {result['answer_relevance']}")
    print(f"  Context Precision: {result['context_precision']}")
    print(f"  Overall: {result['overall_score']}")

    # Irrelevant answer
    irrelevant_answer = "The weather today is sunny with a high of 75 degrees."
    result = evaluate_rag(query, irrelevant_answer, contexts)
    print("\n=== Irrelevant Answer ===")
    print(f"  Faithfulness: {result['faithfulness']}")
    print(f"  Relevance: {result['answer_relevance']}")
    print(f"  Context Precision: {result['context_precision']}")
    print(f"  Overall: {result['overall_score']}")


if __name__ == "__main__":
    main()
