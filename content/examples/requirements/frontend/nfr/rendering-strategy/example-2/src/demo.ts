type Input = {
  personalized: boolean;
  SEOImportant: boolean;
  needsFreshWithinSeconds: boolean;
  highlyInteractive: boolean;
};

function choose(i: Input) {
  if (i.personalized) return "SSR";
  if (i.SEOImportant && i.needsFreshWithinSeconds) return "ISR";
  if (i.SEOImportant) return "Static";
  if (i.highlyInteractive) return "CSR (or SSR + islands)";
  return "Static/ISR";
}

const samples: Input[] = [
  { personalized: true, SEOImportant: false, needsFreshWithinSeconds: false, highlyInteractive: true },
  { personalized: false, SEOImportant: true, needsFreshWithinSeconds: false, highlyInteractive: false },
  { personalized: false, SEOImportant: true, needsFreshWithinSeconds: true, highlyInteractive: false },
  { personalized: false, SEOImportant: false, needsFreshWithinSeconds: false, highlyInteractive: true }
];

console.log(JSON.stringify(samples.map((s) => ({ s, strategy: choose(s) })), null, 2));

