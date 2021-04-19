const Game = require('../models/Game');

exports.createGame = async (req, res) => {
	const { name, tags } = req.body;
	const newGame = new Game(
		{name: name, 
		tags: tags.join(), 
		numberOfPlayers: 0,
	  });
	await newGame.save();
	res.send(""+newGame.id);
};