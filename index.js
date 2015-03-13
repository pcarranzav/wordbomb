// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var SortedArray = require("sorted-array");


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Gameroom

var User = require('./models/user');
var Ranking = require('./models/ranking');
var Word = require('./models/word');


Word.selectNew();

// If there are no correct guesses, we change word every 60 seconds
var wordChangeInterval = {};
var startWordChangeInterval = function() {
  wordChangeInterval = setInterval(function(){
    Word.selectNew();
    io.emit("word change",{
      letters: Word.current_letters
    });
  },60000);
}

startWordChangeInterval();

io.on('connection', function (socket) {
  var addedUser = false;


  // when the client emits 'guess', this listens and executes
  socket.on('guess', function (data) {
    if(Word.check(data.word)){
      clearInterval(wordChangeInterval);
      //Correct guess, should change word and update score and ranking.
      var prev_ranking = User.all[socket.username].ranking;
      User.all[socket.username] += 10;
      Ranking.moveUp(socket.username);
      socket.emit("correct guess",{
        user: User.all[socket.username];
      });
      socket.broadcast.emit("guessed",{
        username: socket.username,
        word: data.word
      })
      if(User.all[socket.username].ranking < 10 && prev_ranking != User.all[socket.username].ranking){
        io.emit("leaderboard",{
          leaderboard: Ranking.getLeaderboard()
        });
      }
      Word.selectNew();
      io.emit("word change",{
        letters: Word.current_letters
      });
      startWordChangeInterval();
    }else{
      var prev_ranking = User.all[socket.username].ranking;
      User.all[socket.username].score -= 1;
      Ranking.moveDown(socket.username);
      socket.emit("incorrect guess",{
        user: User.all[socket.username];
      });
      if(prev_ranking < 10 && prev_ranking != User.all[socket.username].ranking){
        io.emit("leaderboard",{
          leaderboard: Ranking.getLeaderboard()
        });
      }
    }
  });

  // when the client emits 'add user', this listens and executes
  socket.on('login', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    if(!User.all[username]){
      User.all[username] = {
        name: username,
        score:0, 
        ranking: Ranking.nextIndex()
      };
      Ranking.insert(username);
      ++numUsers;
      addedUser = true;
      socket.emit('valid login', {
        numUsers: numUsers,
        user: User.all[username],
        leaderboard: getLeaderboard()
      });
    }else{
      socket.emit('invalid login', {});
    }
    
  });

  // when the user disconnects
  socket.on('disconnect', function () {

  });
});

