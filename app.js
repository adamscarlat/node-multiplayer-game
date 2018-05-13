var path = require('path');
var SocketMgr = require('./server/socketMgr')

var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/src/index.html'))
});
app.use(express.static(path.join(__dirname, '/src/')))


server.listen(8080);

var socketMgr = new SocketMgr(server);
socketMgr.init();