"""
Example 2: Cost Crossover Analysis — Fine-Tuning vs RAG

Demonstrates:
- Calculating total cost of ownership for both approaches
- Finding the break-even point where fine-tuning becomes cheaper
- Factor in training cost, per-request cost, and infrastructure
"""


def calculate_costs(
    daily_requests: int,
    days: int,
    rag_input_tokens: int = 3000,
    rag_output_tokens: int = 500,
    ft_input_tokens: int = 500,
    ft_output_tokens: int = 500,
    model_input_price_per_m: float = 2.50,
    model_output_price_per_m: float = 10.00,
    training_cost: float = 500.0,
    vector_db_monthly: float = 100.0,
    embedding_monthly: float = 50.0,
    gpu_serving_monthly: float = 200.0,
) -> dict:
    """Calculate cumulative costs for RAG vs fine-tuning over time."""
    rag_costs = []
    ft_costs = []

    cumulative_rag = 0.0
    cumulative_ft = training_cost  # Upfront training cost

    for day in range(1, days + 1):
        # RAG costs
        daily_rag_tokens_input = daily_requests * rag_input_tokens
        daily_rag_tokens_output = daily_requests * rag_output_tokens
        daily_rag_api_cost = (
            (daily_rag_tokens_input / 1_000_000) * model_input_price_per_m
            + (daily_rag_tokens_output / 1_000_000) * model_output_price_per_m
        )
        daily_vector_db = vector_db_monthly / 30
        daily_embedding = embedding_monthly / 30
        cumulative_rag += daily_rag_api_cost + daily_vector_db + daily_embedding
        rag_costs.append({"day": day, "total": round(cumulative_rag, 2)})

        # Fine-tuning costs
        daily_ft_tokens_input = daily_requests * ft_input_tokens
        daily_ft_tokens_output = daily_requests * ft_output_tokens
        daily_ft_api_cost = (
            (daily_ft_tokens_input / 1_000_000) * model_input_price_per_m
            + (daily_ft_tokens_output / 1_000_000) * model_output_price_per_m
        )
        daily_gpu = gpu_serving_monthly / 30
        cumulative_ft += daily_ft_api_cost + daily_gpu
        ft_costs.append({"day": day, "total": round(cumulative_ft, 2)})

    # Find crossover point
    crossover_day = None
    for i in range(len(rag_costs)):
        if rag_costs[i]["total"] > ft_costs[i]["total"]:
            crossover_day = rag_costs[i]["day"]
            break

    return {
        "rag_final": rag_costs[-1]["total"],
        "ft_final": ft_costs[-1]["total"],
        "crossover_day": crossover_day,
        "rag_costs": rag_costs,
        "ft_costs": ft_costs,
    }


def main():
    print("=== Cost Crossover Analysis ===\n")

    scenarios = [
        {"daily_requests": 1000, "days": 180, "name": "Low volume (1K/day)"},
        {"daily_requests": 10000, "days": 180, "name": "Medium volume (10K/day)"},
        {"daily_requests": 100000, "days": 180, "name": "High volume (100K/day)"},
    ]

    for scenario in scenarios:
        result = calculate_costs(
            daily_requests=scenario["daily_requests"],
            days=scenario["days"],
        )

        print(f"Scenario: {scenario['name']}")
        print(f"  RAG 6-month cost: ${result['rag_final']:,.2f}")
        print(f"  Fine-Tuning 6-month cost: ${result['ft_final']:,.2f}")
        if result["crossover_day"]:
            print(f"  Crossover: Fine-tuning becomes cheaper after day {result['crossover_day']}")
        else:
            cheaper = "RAG" if result["rag_final"] < result["ft_final"] else "Fine-Tuning"
            print(f"  No crossover: {cheaper} is cheaper throughout")
        print()


if __name__ == "__main__":
    main()
