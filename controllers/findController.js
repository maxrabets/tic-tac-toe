const Game = require('../models/Game');

exports.getGames = async (req, res) => {
	Game.findAll({
		where:{numberOfPlayers: 1}, 
		raw:true})
	.then( games => {
		games.forEach(game => {
			game.tags = game.tags.split(",");
		}
		)
		res.send(games);
	}).catch(err=>console.log(err));
};

exports.connectToTheGame = async (req, res) => {
	const { id } = req.body;
	Game.findByPk(id).then(game=>{
		if(!game) 
			res.sendStatus(404);
		else{
			res.sendStatus(200);
		}
	}).catch(err=>console.log(err));	
};