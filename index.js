// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Gameroom

var users = {};
var ranking = [];
var numUsers = 0;

var moveUpRanking = function(username){
  curr_ranking = users[username].ranking;
  if(curr_ranking > 0 && users[username].score > users[ranking[curr_ranking-1]].score){
    flipRanking(username,ranking[curr_ranking-1]);
    moveUpRanking(username);
  }
};
var moveDownRanking = function(username){
  curr_ranking = users[username].ranking;
  if(curr_ranking < ranking.length-1 && users[username].score < users[ranking[curr_ranking+1]].score){
    flipRanking(username,ranking[curr_ranking-1]);
    moveDownRanking(username);
  }
};
var flipRanking = function(username1,username2){
  var temp_ranking = users[username2].ranking;
  users[username2].ranking = users[username1].ranking;
  users[username1].ranking = temp_ranking;

  ranking[users[username1].ranking] = username1;
  ranking[users[username2].ranking] = username2;

}

io.on('connection', function (socket) {
  var addedUser = false;


  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('login', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    if(!users[username]){
      users[username] = {
        name: username,
        score:0, 
        ranking: ranking.length
      };
      ranking[ranking.length] = username;
      ++numUsers;
      addedUser = true;
      socket.emit('valid login', {
        numUsers: numUsers,
        user: users[username]
      });
    }else{
      socket.emit('invalid login', {
        numUsers: numUsers,
        user: users[username]
      });
    }
    
    // echo globally (all clients) that a person has connected
    /*socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
    */
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});