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

var Word = {
  //We keep words in a sorted array to perform binary search.
  all: new SortedArray(fs.readFileSync('words').split("\n")),

  current: "",

  current_letters: [],

  selectNew: function(){
  	// Select a random word
  	this.current = this.all[Math.floor((Math.random() * (this.all.array.length-1)) + 1)];
  	// And the letters are shuffled
  	this.current_letters = shuffle(this.current.split(""));
  },

  check: function(word){
  	if(this.all.search(word) == -1){
  		return false;
  	}
  	for(c in current_letters){
  		var ind = word.indexOf(c);
  		if(ind == -1)
  			return false;
  		word = word.splice(ind,1);
  	}
  	return true;
  },
}

module.exports = Word;