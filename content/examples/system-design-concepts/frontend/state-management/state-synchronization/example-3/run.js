let owner = 'tab-a';
for (const contender of ['tab-b', 'tab-a', 'tab-c']) {
  const acquired = owner === contender;
  console.log({ contender, acquired, owner });
}
owner = 'tab-c';
console.log({ handoffTo: owner });
