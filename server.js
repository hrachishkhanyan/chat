require('dotenv').config();
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var User = require('./models/user.js')
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var users = [];
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

  io.on('connection', function(socket) {
    io.emit('message', 'Hello from server');
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
    socket.emit('login', function() {

    })
    socket.on('new user', function(user) {
      console.log(user);
      var newUser = new User(user);
      users.push(user.name);
      newUser.save(err => {
        if(err) {
            console.log('Failed to add user');
        } else {
            console.log('User has been added');
        }
      })
    })
    socket.on('login attempt', function(data) {
      User.find().exec(function(err, users) {
        if(err) {
          console.log('An error has occured');
        }
        for(var i = 0; i < users.length; i++) {
          console.log(users);
          if(users[i].name == data.name && users[i].password == data.password) {
            socket.emit('successful login', data);
          } else {console.log('No such user');}
        }
      })
    })
  })
})


server.listen(port);

console.log('Listening to port', port);
