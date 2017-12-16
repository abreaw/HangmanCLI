
// Game Logic for Hangman Node.js app
// -----------------------------------------------------------------------------------
// get new word for user to guess
// setup word w/ dashes for user to see blanks
// allow user to input a letter for guessing
// loop through user input until word guessed or number of guess equal zero
// if user guesses word or guesses equal zero then ask if user wants to play again
// if so then loop through game play steps again
// -----------------------------------------------------------------------------------


// Known issues that need to be resolved 
// -----------------------------------------------------------------------------------
// input from user takes more than just a single character ... need to resolve this still
// -----------------------------------------------------------------------------------



// Load the NPM Package inquirer & fs
var inquirer = require("inquirer");  // allow command line prompts to use
var fs = require("fs");  // allow file reads for words to be used for the hangman game & writes for scores to be recorded (if we get that far)
var colors = require('colors');  // change the colors of the font in the command line

// allow the Word constructor to be used within the hangman file
var Word = require("./word.js");

// global variables needed for the app
var userName = "";
var fileName = "words.txt";
var availableWordList = [];
var totalGuessesAllowed = 10;
var currentGuessCount = 0;
var currentLetterGuessed = "";
var currentWord;
var wrongLettersArray = [];
var wordGuessed = false;

getUserName();


// -----------------------------------------------------------------------------------
// ask user name / store it in a variable and start game play
// -----------------------------------------------------------------------------------
function getUserName() {
	// Create a "Prompt" to get the user's name 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "What is your name?",
	      name: "username"
	    }
	  ])
	  .then(function(inquirerResponse) {
	    // Check to see if the user enters their name
	    if (inquirerResponse.username === "") {
	      console.log("\nSorry, we didn't catch your name.");
	      getUserName();
	    }
	    else {

	    	clearConsoleWindows();

			userName = inquirerResponse.username.toUpperCase();
			console.log("\n\nWelcome " + userName.bold.magenta + "\n\n");
			console.log("****   Let's play some hangman!   ****\n".rainbow);
			startGamePlay();
	    }
	  });
}

// -----------------------------------------------------------------------------------
// get new word for user to guess
// -----------------------------------------------------------------------------------
function startGamePlay() {

	// console.log("Game Started now.");

	readInWordList()

}


// -----------------------------------------------------------------------------------
// get new word for user to guess
// -----------------------------------------------------------------------------------
function getNewWord() {

	// console.log("getting new word from list");

	// console.log("word list has " + availableWordList.length + " words available.");

	resetGame();
	
	var randomIndex = Math.floor(Math.random() * (availableWordList.length));

	// console.log(randomIndex);

	var currentWordGuess = availableWordList[randomIndex];
	
	// console.log(currentWordGuess);

	// make the new word into a word object (w/ letter objects that comprise it??)
	currentWord = new Word(currentWordGuess, totalGuessesAllowed);

	// Left this in here to make it easier to test ... if you scroll up in the console window on the first run through you will see the current word
	currentWord.showCurrentWord();

	currentWord.createWordGameView();
	checkContinue();

}


// -----------------------------------------------------------------------------------
// read in words from the word bank file
// -----------------------------------------------------------------------------------
function readInWordList() {

	console.log("read in word list starting");

	fs.readFile(fileName, "utf8", function(err, data) {
		if (err) {
			return console.log(err);
		}

		availableWordList = data.split(",");

		// console.log(availableWordList);

		getNewWord();

	});

}


function promptUserGuess() {

	// Create a "Prompt" to get the user's guess 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "Guess a letter: ",
	      name: "currGuess",
	      validate: function(value) 
	      	  {
	            var pass = value.match(/[a-z]/i);
	            if (pass) {
	              return true;
	            } else {
		          console.log('  -- Please enter a valid letter');
		        }
	          }
	    }
	  ])
	  .then(function(inquirerResponse) {
	    
	  	currentLetterGuessed = inquirerResponse.currGuess.toLowerCase();
	  	var letterAlreadyGuessed = false;

	  	for (var i = 0; i < wrongLettersArray.length; i++) {
	  		if (wrongLettersArray[i] === currentLetterGuessed) {

	  			letterAlreadyGuessed = true;
	  		}
	  	}

	  	for (var i = 0; i < currentWord.guessView.length; i++) {
	  		
	  		if (currentWord.guessView[i] === currentLetterGuessed) {

	  			letterAlreadyGuessed = true;
	  		}
	  	}

	  	// console.log(currentLetterGuessed);

	    // Check to see if the user enters a proper guess
	    if (inquirerResponse.currGuess === "" || letterAlreadyGuessed) {
	      console.log("\nSorry, please make a another guess");
	      promptUserGuess();
	    }
	    else {
	      
	      // console.log("\n\nGot your guess\n\n");
	      var isCorrect = currentWord.checkLetter(currentLetterGuessed);

	      if (!isCorrect) {
	      	wrongLettersArray.push(currentLetterGuessed);
	      	currentGuessCount++;
	      }
	      checkContinue();
	    }
	});

}


function whatsNext(playerWon) {

	if (playerWon) {

		console.log("\n" + userName.bgCyan + " you WON! Congrats!\n".bgCyan);
	} 
	else {

		console.log("\nSorry, ".yellow + userName.yellow + " you lost :(\n".yellow);		
	}

	// Create a "Prompt" to see if user wants to play again 
	inquirer
	  .prompt([
	    // Here we create a basic text prompt.
	    {
	      type: "confirm",
	      message: "Would you like to play again?",
	      name: "continue"
	    }
	  ])
	  .then(function(inquirerResponse) {
	    
	  	if (inquirerResponse.continue) {
	      console.log("\nLet's Play Again!\n".rainbow);
	      getNewWord();
	    }
	    else {
	      
	      console.log("\n\nThanks for playing!\n\n");
	      // add in score details if time permits here
	      return;
	    }
	});

}

function checkContinue() {

	// check to see if current guesses are less than total allowed
	if (currentGuessCount < totalGuessesAllowed) {

		clearConsoleWindows();

		console.log("\n\nWelcome " + userName.bold.magenta + "\n\n");
		console.log("****   Let's play some hangman!   ****\n".rainbow);

	    currentWord.showUserViewWord();
	    showGuessedLetters();
	    
	    // check to see if word already guessed
	    if (currentWord.letterGuessedCount < currentWord.currentWord.length) {
		    promptUserGuess();
	    } else {

	    	whatsNext(true);
	    }

	 	// console.log(currentGuessCount);
	} else {

		whatsNext(false);
		return;
	}
}

function showGuessedLetters() {

	// console.log("wrong letters array length = " + wrongLettersArray.length);
	// console.log(wrongLettersArray);
	if (wrongLettersArray.length > 0 && wrongLettersArray != undefined) {
		console.log("Letters Already Guessed: " + wrongLettersArray.join(",").red);
		console.log("---------------------------------------------");
	} 
	// else {
	// 	console.log("No Guesses yet");
	// }
}

function resetGame() {

	currentLetterGuessed = "";
	currentWord = "";
	wrongLettersArray = [];
	currentGuessCount = 0;

}


// -----------------------------------------------------------------------------------
// clears the console view so the user only sees the game play happening
// -----------------------------------------------------------------------------------
function clearConsoleWindows() {

	if (process.platform === 'win32') {
		console.log("\u001b[2J\u001b[0;5H");	
	} else {
		console.log("user not windows user");
	}

}