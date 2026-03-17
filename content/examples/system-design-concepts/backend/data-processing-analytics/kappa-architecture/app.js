const { onEvent } = require('./stream');
const { replay } = require('./replay');
replay([{ id: 1 }], onEvent);