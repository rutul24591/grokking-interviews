import { NextRequest, NextResponse } from "next/server";
import { searchState } from "@/lib/store";

const corpus = [
  { id: "a1", title: "Distributed Systems Basics", tags: ["distributed", "systems"], summary: "How large-scale systems coordinate work.", synonyms: ["architecture"], score: 9.8 },
  { id: "a2", title: "Scaling Search Infrastructure", tags: ["search", "infrastructure"], summary: "Operating shards and search latency budgets.", synonyms: ["elasticsearch"], score: 8.7 },
  { id: "a3", title: "Feed Ranking in Large Systems", tags: ["feed", "systems"], summary: "Ranking and blending across candidate sets.", synonyms: ["recommendations"], score: 7.6 },
  { id: "a4", title: "Frontend Rendering Strategies", tags: ["frontend"], summary: "SSR, CSR, and hybrid rendering trade-offs.", synonyms: ["ui"], score: 5.1 }
];

function tokenize(query: string) {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { query: string; analyzer: "standard" | "synonym" };
  const query = body.query.trim().toLowerCase();
  const tokens = tokenize(query);

  const results = corpus
    .map((item) => {
      const matchedFields: string[] = [];
      let score = 0;

      if (tokens.some((token) => item.title.toLowerCase().includes(token))) {
        matchedFields.push("title");
        score += item.score;
      }
      if (tokens.some((token) => item.tags.includes(token))) {
        matchedFields.push("tags");
        score += 1.4;
      }
      if (tokens.some((token) => item.summary.toLowerCase().includes(token))) {
        matchedFields.push("summary");
        score += 0.9;
      }
      if (body.analyzer === "synonym" && tokens.some((token) => item.synonyms.includes(token))) {
        matchedFields.push("synonym");
        score += 1.2;
      }

      return {
        id: item.id,
        title: item.title,
        score: Number(score.toFixed(2)),
        explanation: matchedFields.length
          ? `${matchedFields.join(" + ")} contributed to the final score.`
          : "No matching terms survived analysis.",
        matchedFields,
        analyzer: body.analyzer
      };
    })
    .filter((item) => item.matchedFields.length > 0)
    .sort((left, right) => right.score - left.score);

  searchState.query = body.query;
  searchState.analyzer = body.analyzer;
  searchState.queryHistory = [body.query, ...searchState.queryHistory.filter((item) => item !== body.query)].slice(0, 5);
  searchState.totalHits = results.length;
  searchState.tookMs = 12 + results.length * 5 + (body.analyzer === "synonym" ? 6 : 0);
  searchState.results = results;
  searchState.warnings = results.length === 0 ? ["No matches returned. Consider synonym expansion or relaxed filters."] : [];
  searchState.lastMessage = results.length
    ? `Returned ${results.length} hits using the ${body.analyzer} analyzer.`
    : "No matching documents found in the simulated index.";
  return NextResponse.json(searchState);
}
