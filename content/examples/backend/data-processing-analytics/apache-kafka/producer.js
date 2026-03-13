function publish(event) {
  console.log('send', event.id);
}

publish({ id: 'o1' });