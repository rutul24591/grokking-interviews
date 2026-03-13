exports.handler = async (event) => {
  console.log('process', event.id);
  return { ok: true };
};