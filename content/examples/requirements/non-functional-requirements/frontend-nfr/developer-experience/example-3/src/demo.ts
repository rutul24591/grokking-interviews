type ValidationRun = { environment: 'dev' | 'prod'; warnings: number; errors: number; requestIdPresent: boolean };

function assessDeveloperFeedback(run: ValidationRun) {
  const actionable = run.requestIdPresent && (run.warnings + run.errors) > 0;
  return {
    env: run.environment,
    actionable,
    releaseGate: run.errors > 0 && run.environment === 'prod' ? 'block-deploy' : 'allow-with-feedback',
  };
}

const results = [
  { environment: 'dev', warnings: 2, errors: 0, requestIdPresent: true },
  { environment: 'prod', warnings: 1, errors: 2, requestIdPresent: true },
].map(assessDeveloperFeedback);

console.table(results);
if (results[1].releaseGate !== 'block-deploy') throw new Error('Prod config errors should block deploy');
