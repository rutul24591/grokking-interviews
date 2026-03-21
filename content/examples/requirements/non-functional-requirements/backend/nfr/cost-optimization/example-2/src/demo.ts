function perMillion(totalUsd: number, monthlyRequests: number) {
  return (totalUsd / monthlyRequests) * 1_000_000;
}

const totalUsd = 3150.25;
const monthlyRequests = 25_000_000;

console.log(
  JSON.stringify(
    {
      totalUsd,
      monthlyRequests,
      costUsdPerMillionRequests: Math.round(perMillion(totalUsd, monthlyRequests) * 100) / 100
    },
    null,
    2
  )
);

