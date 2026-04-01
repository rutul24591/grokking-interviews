const dataset = [
  { id: '1', title: 'SSR basics', popularity: 70, recencyHours: 10, category: 'frontend' },
  { id: '2', title: 'Feed ranking', popularity: 95, recencyHours: 48, category: 'backend' },
  { id: '3', title: 'Search analytics', popularity: 82, recencyHours: 4, category: 'backend' },
  { id: '4', title: 'Rendering patterns', popularity: 68, recencyHours: 1, category: 'frontend' }
];
export const filteringState = { filters: { category: 'all' }, sort: 'popular', results: dataset, lastMessage: 'Initial results loaded.' };
export { dataset };
