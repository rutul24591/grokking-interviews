const messages = [
  { tabId: 'a', origin: 'a', value: 'dark' },
  { tabId: 'a', origin: 'b', value: 'light' }
];
console.log(messages.map((message) => ({ ...message, shouldApply: message.tabId !== message.origin })));
