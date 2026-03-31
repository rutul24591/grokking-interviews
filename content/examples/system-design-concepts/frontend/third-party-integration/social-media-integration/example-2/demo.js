const canonical = "https://systemdesign.example.com/articles/oauth-integration?utm_source=social";
const cleaned = canonical.split("?")[0];
for (const provider of ["linkedin", "x", "facebook"]) {
  console.log(`${provider} -> ${cleaned}`);
}
