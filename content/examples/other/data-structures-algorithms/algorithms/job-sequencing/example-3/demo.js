const { scheduleJobs } = require("../example-1/algorithm");
console.table(scheduleJobs([{ id: "x", deadline: 0, profit: 99 }]));
console.table(scheduleJobs([{ id: "a", deadline: 1, profit: 10 }, { id: "b", deadline: 1, profit: 10 }]));
