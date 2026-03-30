function parse(query) {
  const params = new URLSearchParams(query);
  return {
    page: Math.max(1, Number(params.get('page') || '1')),
    tags: params.getAll('tag').filter(Boolean),
    sort: ['latest', 'popular'].includes(params.get('sort') || '') ? params.get('sort') : 'latest'
  };
}

function serialize(state) {
  const params = new URLSearchParams();
  if (state.page > 1) params.set('page', String(state.page));
  for (const tag of state.tags) params.append('tag', tag);
  if (state.sort !== 'latest') params.set('sort', state.sort);
  return params.toString();
}

const parsed = parse('page=0&tag=frontend&tag=state&sort=broken');
console.log({ parsed, canonical: serialize(parsed) });
