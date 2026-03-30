const previous = { filters: { severity: 'high', owners: ['core'] } };
const next = { ...previous };
next.filters.severity = 'low';
next.filters.owners.push('growth');
console.log({ previous, next, sameNestedObject: previous.filters === next.filters });
