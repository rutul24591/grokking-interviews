// Backpressure if buffer full
if (buffer.length > MAX) throw new Error('backpressure');
