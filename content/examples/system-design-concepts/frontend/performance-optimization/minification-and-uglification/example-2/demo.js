const lines = [
  "return data.user.name",
  "return data['user-name']",
  "return analytics[_privateField]",
  "return report._internalValue",
];

for (const line of lines) {
  const safeForPropertyMangling =
    !line.includes("['") && !line.includes("[_") && !line.includes(".user.");
  const recommendation = line.includes("._")
    ? "safe only with a reserved-property naming policy"
    : safeForPropertyMangling
      ? "safe for property mangling"
      : "do not mangle blindly";
  console.log(`${line} -> ${recommendation}`);
}
