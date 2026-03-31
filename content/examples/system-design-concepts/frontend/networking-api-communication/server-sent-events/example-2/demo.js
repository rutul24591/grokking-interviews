const raw = "data: first update\\n\\ndata: second update\\n\\n";
for (const chunk of raw.split("\\n\\n").filter(Boolean)) {
  console.log(chunk.replace("data: ", ""));
}
