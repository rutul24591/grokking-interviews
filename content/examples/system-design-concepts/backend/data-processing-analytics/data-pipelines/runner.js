const dag = require('./dag.json');

function run(task) {
  console.log('run', task.id);
}

for (const t of dag.tasks) run(t);