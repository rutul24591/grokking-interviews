async function logout(cache, sid) {
  await cache.del('sess:' + sid);
}