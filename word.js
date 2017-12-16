

// allow the Letter constructor to be used within the Word file
var Letter = require("./letter.js");
var colors = require('colors');  // change the colors of the font in the command line


// constructor function creating a new word object
function Word(currentWord, numGuessesTotal) {

	this.currentWord = currentWord;
	this.currentWordLetterArray = [];
	this.guessView = [];
	this.letterGuessedCount = 0;

	this.showCurrentWord = function() {

		console.log("---------------------------------------------");
		console.log("current word to guess is " + this.currentWord);
		console.log("---------------------------------------------");
	};

	this.showUserViewWord = function() {

		// get # of spacess that will be displayed to put the user view of the word in the middle of the lines
		// 45 (# of lines above and below word) minus word length * 2 (because of the spaces between the dashes) / 2 (to get the left side spaces that should be remaining) ... -4 (because it still didn't look right!!)
		var loopIndex = Math.floor((45 - (this.currentWord.length)) / 2) - 4;

		var spaceArray = [];

		// console.log(loopIndex);

		console.log("---------------------------------------------");

		for (var i = 0; i < loopIndex; i++) {
			spaceArray.push(" ");
		};

		console.log(spaceArray.join("") + this.guessView.join(" ").cyan);
		console.log("---------------------------------------------");
	};

	this.createWordGameView = function() {

		// console.log("turning current word into a game play view for user to guess");

		for (var i = 0; i < this.currentWord.length; i++) {
			var getView = new Letter(this.currentWord[i]);

			// console.log(getView);
			this.currentWordLetterArray.push(getView);
			this.guessView.push(getView.hidden);
		}

		// console.log("user view of word");
		// console.log(this.guessView);
	};

	this.checkLetter = function(currLetter) {

		var isInWord = false;

		// console.log(this.guessView);
		
		// loop through current word letters
		for (var i = 0; i < this.currentWord.length; i++) {
			
			// check to see if guessed letter is in the current word
			if (currLetter === this.currentWord[i]) {

				// console.log(this.guessView[i]);
				this.guessView[i] = this.currentWordLetterArray[i].visible
				// console.log(this.guessView[i]);
				isInWord = true;
				this.letterGuessedCount++;
			}
		}

		return isInWord; // return true or false

	};   // end of checkLetter function
	
}  // end of Word object constructor


// export the Word constructor to be used within hangman app
module.exports = Word;

