Wordbomb
=========

A simple multiplayer word-guessing game.

The game consists in guessing a word with certain letters before everybody else. Correct guesses add 10 points, incorrect ones cost 1 point.
If nobody guesses the word in 60 seconds, another one is chosen. A correct guess is any word that appears in our dictionary and uses the current letters.

Installation
-------------
Requires node.js and npm.
```
npm install
```

To run it:
```
node index.js
```
And go to localhost:3000.

Design choices
--------------
 I used node.js with socket.io. An express server serves static content (a single-page app built with jQuery), and all comms are done via socket.io.
 There's no persistence (a server restart will erase all data), but it could be implemented with mongoose in a relatively straightforward way (the models that should be persisted are User and Ranking).

 Words are saved in a sorted array to allow fast search. Users are saved in an Object to allow hash lookup, and the Ranking is just a (ranking-sorted) array of usernames which also allows easily looking up and modifying positions.

 The general structure is based on [socket.io's chat example](https://github.com/Automattic/socket.io/tree/master/examples/chat).
 Frontend uses a bit of Bootstrap, but there's no real design work there.
 I also used toastr to show info/success/error messages.

Some possible improvements
---------------------------
- Adding persistence with MongoDB and mongoose
- Limiting what kind of words can be chosen by the server (some are really really hard to guess)
- Actually designing the UI
- Showing which letters a user has already used
