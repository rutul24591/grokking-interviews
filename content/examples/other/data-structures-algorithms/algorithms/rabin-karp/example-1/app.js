const { rabinKarp } = require("./algorithm");
const text = "ERROR timeout shard-2; retrying; timeout shard-2";
console.log("Match @", rabinKarp(text, "timeout"));
console.log("Miss @", rabinKarp(text, "success"));
