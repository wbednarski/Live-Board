let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let redis = require('redis');
let redisClient = redis.createClient();

const SETTINGS = {
  MESSAGE_MAX_LENGTH: 199,
  MAX_MESSAGES: 9
};

app.use(express.static(__dirname + '/public'));

io.on('connection', function (client) {
  client.emit('settings', SETTINGS);

  redisClient.lrange('messages', 0, -1, function (error, data) {
    data.reverse().forEach(function (message) {
      client.emit('message', message);
    });
  });

  client.on('message', function (message) {
    if (message.length < SETTINGS.MESSAGE_MAX_LENGTH) {
      io.emit('message', message);
      redisClient.lpush('messages', message);
      redisClient.ltrim('messages', 0, SETTINGS.MAX_MESSAGES);
    }
  });

});

server.listen(8080);
