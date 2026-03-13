const { drain } = require('./queue');
function process() {
  for (const msg of drain()) console.log('send', msg.channel, msg.to);
}
setInterval(process, 1000);