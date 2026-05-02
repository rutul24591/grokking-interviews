const { kmpSearch, buildLps } = require("./algorithm");
console.log("LPS for 'ababaca':", buildLps("ababaca"));
console.log("Match:", kmpSearch("ERROR timeout shard-2 timeout shard-3", "timeout"));
console.log("Miss:", kmpSearch("abcd", "ef"));
