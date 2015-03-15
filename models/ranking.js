
var User = require('./user');

var Ranking = {

  list: [],

  moveUp: function(username){
    curr_ranking = User.all[username].ranking;
    if(curr_ranking > 0 && User.all[username].score > User.all[this.list[curr_ranking-1]].score){
      this.flip(username,this.list[curr_ranking-1]);
      this.moveUp(username);
    }
  },

  moveDown: function(username){
    curr_ranking = User.all[username].ranking;
    if(curr_ranking < this.list.length-1 && User.all[username].score < User.all[this.list[curr_ranking+1]].score){
      this.flip(username,this.list[curr_ranking+1]);
      this.moveDown(username);
    }
  },
  flip: function(username1,username2){
    var temp_ranking = User.all[username2].ranking;
    User.all[username2].ranking = User.all[username1].ranking;
    User.all[username1].ranking = temp_ranking;

    this.list[User.all[username1].ranking] = username1;
    this.list[User.all[username2].ranking] = username2;

  },

  getLeaderboard: function(){
    return this.list.slice(0,10).map(function(val){
      return {username: val, score: User.all[val].score};
    })
  },

  nextIndex: function(){
    return this.list.length;
  },

  insert: function(username){
    this.list[this.list.length] = username;
    console.log(this.all);
  }
};

module.exports = Ranking;