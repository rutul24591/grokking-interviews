let isSubmitting = false;
async function validateSlug(slug) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return slug !== 'taken';
}

async function submit(slug) {
  if (isSubmitting) return 'blocked-duplicate-submit';
  isSubmitting = true;
  const available = await validateSlug(slug);
  const result = available ? 'submitted' : 'slug-conflict';
  isSubmitting = false;
  return result;
}

console.log(await submit('taken'));
console.log(await submit('workspace-alpha'));
