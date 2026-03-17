function emit(evt) {
  console.log('emit', evt.type);
}

emit({ type: 'order.created' });