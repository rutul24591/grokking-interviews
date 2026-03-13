const http = require('http');
const { sendFile } = require('./sendfile');
http.createServer((req,res)=>sendFile('file.bin',res)).listen(3000);