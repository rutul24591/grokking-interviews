const etag = 'abc123';
for (const header of [null, 'wrong', 'abc123']) {
  console.log({ ifNoneMatch: header, result: header === etag ? 304 : 200 });
}
