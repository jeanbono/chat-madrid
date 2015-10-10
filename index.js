var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var adapter = require('socket.io-redis');
var redis = require('redis').createClient;

var rds   = require("url").parse(process.env.REDIS_URL);

var pub = redis(rds.port, rds.hostname, { auth_pass: rds.auth.split(':')[1] });
var sub = redis(rds.port, rds.hostname, { detect_buffers: true, auth_pass: rds.auth.split(':')[1] });

io.adapter(adapter({ pubClient: pub, subClient: sub }));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});
