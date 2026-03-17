function handle(evt) {
  console.log('handle', evt.type);
}

handle({ type: 'order.created' });