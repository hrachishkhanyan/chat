require('dotenv').config();
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var User = require('./models/user.js')
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var users = [];
var index = 0;
// var chatColors = ['#8633FF', '#FFBB33', '#33FFE3', '#8AFF33']
var chatColors = ['purple', 'red', 'blue', 'yellow'];

app.use(bodyParser.json());

mongoose.connect(process.env.DB_LINK, function(err){
  if(err) {
    console.log('Could not connect to the database');
  }
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/interface.html');
  });

  app.get('/interface.js', function(req, res) {
    res.sendFile(__dirname + '/interface.js');
  });

  app.get('/semantic.js', function(req, res) {
    res.sendFile(__dirname + '/interface.js');
  });

  io.on('connection', function(socket) {
    socket.emit('message', 'Hello from server');
    socket.on('chat message', function(msg){
        io.emit('add message',
                {
                  username: socket.username,
                  message: msg,
                  color: socket.chatColor
                }
              )
          });
    socket.on('new user', function(data) {
      console.log(data);
      var newUser = new User(data);
      users.push(data.name);
      newUser.save(err => {
        if(err) {
            console.log('Failed to add user');
        } else {
            console.log('User has been added');
        }
      })
    })
    socket.on('login attempt', function(user) {
      User.findOne({name: user.name, password: user.password}).exec(function(err, user) {
        if(err) {
          console.log('An error has occured');
        } if(!user) {
          console.log('No such user');
        } else {
            users.push(user.name);
            socket.username = user.name;
            socket.chatColor = chatColors[index];
            socket.emit('successful login', {
                username: socket.username
              });
            socket.broadcast.emit('connected user', {
                username: socket.username
              });
              if(index > chatColors.length) index = 0;
              index++;
          }

      })
    })
  })
})


server.listen(port);

console.log('Listening to port', port);
