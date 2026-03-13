const evt = new EventSource('http://localhost:3000/events');
evt.onmessage = (e) => console.log('event', e.data);