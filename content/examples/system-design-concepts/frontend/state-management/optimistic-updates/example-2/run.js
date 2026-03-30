const initial = ['draft'];
const optimistic = [...initial, 'new-item'];
const rollback = initial;
console.log({ optimisticSuccess: optimistic, optimisticFailureRollback: rollback });
