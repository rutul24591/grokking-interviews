const { boyerMoore } = require("./algorithm");
const text = "ERROR timeout shard-2; retrying; timeout shard-2";
console.log("Match @", boyerMoore(text, "timeout"));
