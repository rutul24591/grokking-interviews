for (let attempt = 1; attempt <= 4; attempt += 1) {
  const delay = 200 * 2 ** (attempt - 1);
  console.log(`attempt ${attempt} -> wait ${delay} ms`);
}
