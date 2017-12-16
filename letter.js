

// constructor function creating a new Letter object
var Letter = function(value) {

	this.visible = value;
	this.hidden = "_";

};

// export the Letter constructor to be used within hangman app
module.exports = Letter;
