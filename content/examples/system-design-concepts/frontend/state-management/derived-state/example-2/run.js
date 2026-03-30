function createSelector(project) {
  let lastArg;
  let lastValue;
  let recomputations = 0;
  return {
    run(arg) {
      if (arg !== lastArg) {
        recomputations += 1;
        lastArg = arg;
        lastValue = project(arg);
      }
      return lastValue;
    },
    recomputations: () => recomputations
  };
}

const selector = createSelector((filter) => filter.team.toUpperCase());
const stable = { team: 'core' };
selector.run(stable);
selector.run(stable);
selector.run(stable);
console.log('stable recomputations', selector.recomputations());
selector.run({ team: 'core' });
selector.run({ team: 'core' });
console.log('after unstable inputs', selector.recomputations());
