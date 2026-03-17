// HTTP cache control.

const etag='v1';
const ifNone='v1';
console.log(ifNone==etag?304:200);
