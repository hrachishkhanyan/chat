//window.onload = function() {
$(() => {
  // $('.ui.page.dimmer').dimmer('show');
  var socket = io();
  //Sign up
  const signupForm = $('#signupForm');
  const nameInput = $('#signupUserName');
  const passwordInput = $('#signupPassword');
  const confirmPassword = $('#signupConfirmPassword');
  const signUpButton = $('#signupSubmit');
  const toLogin = $('#openLogin');

  //login
  const loginForm = $('#loginForm');
  const nameInputLog = $('#loginUsername');
  const passwordInputLog = $('#loginPassword');
  const loginButton = $('#loginSubmit');
  const toSignup = $('#openSignup');

  //chat
  const button = $('#button');
  const input = $('#input');
  const form = $('#form');
  const messageBoard = $('#messageBoard');
  const dimForm = $('#dimForm');
  const sideBar = $('.sidenav');

  //rooms
  // const createRoom = $('#')

  $('.sidenavhelper').hover(function() {sideBar.removeClass('hidden');});
  sideBar.mouseleave(function(){sideBar.addClass('hidden')})


  toSignup.on('click', () => {
    signupForm.removeClass('hidden');
    loginForm.addClass('hidden');
  });

  toLogin.on('click', () => {
    loginForm.removeClass('hidden');
    signupForm.addClass('hidden');
  });

  signUpButton.click(function() {
    if(!nameInput.val() || !passwordInput.val() || !confirmPassword.val()) return;
    const userName = nameInput.val();
    if(passwordInput.val() != confirmPassword.val()) {
      if($('#error').length != 0) return;
      signupForm.append(`<p id="error" style="color:#cc0000">passwords do not match</p>`);
      return;
    }
    const password = passwordInput.val();
    var data = {
                  name: userName,
                  password: password
                };
    socket.emit('new user', data);
    loggedIn = true;
    $('.ui.page.dimmer').dimmer('hide');
 })

  loginButton.click(function() {
    event.preventDefault();

    if(!nameInputLog.val() || !passwordInputLog.val()) return;
    var data = {
                  name: nameInputLog.val(),
                  password: passwordInputLog.val()
                }
    socket.emit('login attempt', data);
    socket.on('successful login', function(data) {
      $('.ui.page.dimmer').dimmer('hide');
      $('.ui.sidebar').sidebar('toggle');
      //users.push(data.user.name);
      loggedIn = true;
    })
  })

  form.on('submit', event => {
      event.preventDefault();

      const message = input.val();
      if(!message) return;
      socket.emit('chat message', message);
      input.val('');
  })

  socket.on('connected user', function(data) {
    if(loggedIn)  {
      messageBoard.append(`<div style="font-style: italic">${data.username} has connected</div>`);
    }
  })

  socket.on('add message', function(data) {
          messageBoard.append(`<div>${data.username}</div>`);
          messageBoard.append(`<li class="ui ${data.color} message">${data.message}</li>`);
  })
  socket.on('message', function(msg){
      if($('.ui.green.message').length != 0) return;
      messageBoard.append(`<li class="ui green message">${msg}</li>`);
  });
})
