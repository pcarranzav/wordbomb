$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputWord = $('.inputWord'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $gamePage = $('.game.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  //var typing = false;
  //var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "500",
    "timeOut": "2500",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      socket.emit('login', username);
    }
  }

  function changeLetters(newLetters){
    $('#letters').html("");
    $.each(newLetters, function(i, letter){
      $('#letters').append("<li>" + letter + "</li>");
    });
  }

  function showLeaderboard(newLeaderboard){
    var table = $('.leaderboard table tbody');
    table.html('');
    $.each(newLeaderboard, function(i,user){
      table.append("<tr><td>" + user.username + "</td><td>" + user.score + "</td></tr>");
    })
  }

  function changeScore(newScore){
    $("#userScore").html(newScore);
  }

  socket.on('valid login', function(data){
    $loginPage.off('click');
    $loginPage.fadeOut(400, function(){
      $gamePage.show();
      $currentInput = $inputWord.focus();
      connected = true;
      changeLetters(data.letters);
      showLeaderboard(data.leaderboard);

    });
    
  });

  socket.on('invalid login', function(){
    toastr.error('Username already taken.', 'Invalid login');
    username = undefined;
  });

  // Sends a guess
  function sendGuess () {
    var message = $inputWord.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputWord.val('');
      socket.emit('guess', {word: message});
    }
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendGuess();
      } else {
        setUsername();
      }
    }
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function(){
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputWord.click(function(){
    $inputWord.focus();
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('word change', function(data){
    changeLetters(data.letters);
  });

  socket.on('correct guess', function(data){
    changeScore(data.user.score);
  });

  socket.on('incorrect guess', function(data){
    changeScore(data.user.score);
  });

  socket.on('leaderboard', function(data){
    showLeaderboard(data.leaderboard);
  });

});