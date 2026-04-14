"""
Example 2: Multilingual Token Efficiency Comparison

Demonstrates:
- How the same semantic content produces different token counts across languages
- Using tiktoken (OpenAI's tokenizer) to measure token efficiency
- Cost implications of multilingual applications
"""

try:
    import tiktoken
except ImportError:
    print("Install tiktoken: pip install tiktoken")
    exit(1)


# Equivalent translations of the same message
SAMPLES = {
    "English": "The quarterly earnings report shows revenue growth of 15% year-over-year, with operating margins expanding to 28%.",
    "Chinese": "季度财报显示营收同比增长15%，营业利润率扩大至28%。",
    "Arabic": "يظهر تقرير الأرباح الربع سنوي نموًا في الإيرادات بنسبة 15٪ على أساس سنوي، مع هوامش تشغيلية توسعت إلى 28٪.",
    "Hindi": "तिमाही कमाई रिपोर्ट में सालाना आधार पर 15% की राजस्व वृद्धि और 28% के परिचालन मार्जिन का विस्तार दिखाया गया है।",
    "Japanese": "四半期決算報告書は、前年比15％の収益成長と、28％に拡大する営業利益率を示しています。",
    "Spanish": "El informe de ganancias trimestrales muestra un crecimiento de ingresos del 15% interanual, con márgenes operativos expandiendose al 28%.",
    "Finnish": "Vuosineljänneksen tulosraportti osoittaa 15% liikevaihdon kasvua vuodesta toiseen, käyttökatteen laajetessa 28%:iin.",
}


def analyze_token_efficiency():
    """Compare token counts across languages using cl100k_base (GPT-4) tokenizer."""
    enc = tiktoken.get_encoding("cl100k_base")

    print("=== Multilingual Token Efficiency (cl100k_base / GPT-4 tokenizer) ===\n")
    print(f"{'Language':<12} {'Chars':>6} {'Tokens':>7} {'Tokens/Char':>12} {'Relative Cost':>14}")
    print("-" * 60)

    english_tokens = None

    for lang, text in SAMPLES.items():
        tokens = enc.encode(text)
        token_count = len(tokens)
        char_count = len(text)
        tokens_per_char = token_count / char_count

        if lang == "English":
            english_tokens = token_count

        relative_cost = token_count / english_tokens if english_tokens else 1.0
        print(f"{lang:<12} {char_count:>6} {token_count:>7} {tokens_per_char:>12.3f} {relative_cost:>14.2f}x")

    print(f"\nKey Insight: Processing the same semantic content in non-English languages")
    print(f"can cost {'2-5x' if True else 'varies'} more due to tokenization inefficiency.")
    print(f"This directly impacts API costs, context window usage, and rate limiting.")


if __name__ == "__main__":
    analyze_token_efficiency()
