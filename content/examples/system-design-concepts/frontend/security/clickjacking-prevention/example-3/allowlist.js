const allow = ["'self'", "https://partner.example", "https://*.trusted.example"];
process.stdout.write(`frame-ancestors ${allow.join(" ")}\n`);

