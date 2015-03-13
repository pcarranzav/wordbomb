var SortedArray = require("sorted-array");
var fs = require('fs');
var shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

var words_from_file = fs.readFileSync('words').toString().split("\n");
words_from_file.splice(words_from_file.length-1,1);
var Word = {
  //We keep words in a sorted array to perform binary search.
  all: new SortedArray([]),

  current: "",

  current_letters: [],

  selectNew: function(){
  	// Select a random word
  	this.current = this.all.array[Math.floor((Math.random() * (this.all.array.length-1)) + 1)];
  	// And the letters are shuffled
  	this.current_letters = shuffle(this.current.split(""));
  },

  check: function(word){
  	
  	if(this.all.search(word) == -1){
  		return false;
  	}
  	word = word.split("");
  	for(c in this.current_letters){
  		var ind = word.indexOf(this.current_letters[c]);
  		if(ind == -1)
  			return false;
  		word.splice(ind,1);
  	}
  	return true;
  },
}
//Hack to add all words without using SortedArray.insert (as it's already sorted)
Word.all.array = words_from_file;
module.exports = Word;