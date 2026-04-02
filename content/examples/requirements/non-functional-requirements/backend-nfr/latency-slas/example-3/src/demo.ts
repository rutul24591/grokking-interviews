function shouldHedge(p95Ms: number, hedgeAfterMs: number) {
  return p95Ms > hedgeAfterMs;
}

console.log(
  JSON.stringify(
    {
      p95Ms: 320,
      hedgeAfterMs: 180,
      hedge: shouldHedge(320, 180)
    },
    null,
    2
  )
);

