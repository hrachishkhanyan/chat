//window.onload = function() {
$(() => {

  $('.ui.page.dimmer').dimmer('show');

  //Sign up
  var nameInput = $('#userName');
  var passwordInput = $('#password');
  var confirmPassword = $('#confirmPassword');
  var signUpButton = $('#signUp');

  //login
  var nameInputLog = $('#userNameLog');
  var passwordInputLog = $('#passwordLog');
  var loginButton = $('#loginButton');

  //chat
  var button = $('#button');
  var input = $('#input');
  var form = $('#form');
  var messageBoard = $('#messageBoard');
  var dimForm = $('#dimForm');

  var index = 0;
  var chatColors = ['blue', 'yellow', 'red'];
  var userColor = '';
  // dimForm.on('submit', event => {
  //   event.preventDefault();
  //   $('.ui.page.dimmer').dimmer('toggle');
  //   console.log($('.ui.page.dimmer').dimmer('is enabled'));
  // })
  signUpButton.click(function() {
    if(!nameInput.val() || !passwordInput.val() || !confirmPassword.val()) return;
    const userName = nameInput.val();
    if(passwordInput.val() != confirmPassword.val()) {
      $('#pass').append(`<label>passwords do not match</label>`);
      return;
    }
    const password = passwordInput.val();
    var data = {
                  name: userName,
                  password: password
                };
    socket.emit('new user', data);
    $('.ui.page.dimmer').dimmer('show');
    nameInput.val('');
    passwordInput.val('');
    confirmPassword.val('');
    // $('').append(`<label>Successfully signed up</label>`)
  })

  loginButton.click(function() {
    if(!nameInputLog.val() || !passwordInputLog.val()) return;
    var data = {
                  name: nameInputLog.val(),
                  password: passwordInputLog.val()
                }
                console.log(data);
    socket.emit('login attempt', data);
    socket.on('successful login', function(data) {
      $('.ui.page.dimmer').dimmer('hide');
      userColor = chatColors[index];
      index++;
    })
  })

  form.on('submit', event => {
      event.preventDefault();
      const message = input.val();
      if(!message) return;
      socket.emit('chat message', message);
      input.val('');
  })

  var socket = io();
  socket.on('login', function(userNames) {
    users = userNames;
  })
  socket.on('chat message', function(msg) {
    // messageBoard.append(`<div>${users[index]}</div>`);
    messageBoard.append(`<li class="ui ${userColor} message">${msg}</li>`);
  })
  socket.on('message', function(msg){
    messageBoard.append(`<li class="ui green message">${msg}</li>`);
  });
})
