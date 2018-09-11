const express = require('express');
const opn = require('opn');
const myProxy = require('./my-proxy');

const app = express();
app.listen(9090);
app.use('/', express.static('./dist/') );
myProxy(app);

opn('http://localhost:9090/main.html');
