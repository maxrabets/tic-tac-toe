const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
require("dotenv").config();
const Game = require('./models/Game');
const sequelize = require("./sequelize");
const ws = require("ws");
const findRouter = require("./routes/findRouter.js");
const createRouter = require("./routes/createRouter.js");
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({server});

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.use("/", createRouter);;
app.use("/", findRouter);

var clients = []

wss.on('connection', (ws, req) => {
	ws.ip = ws._socket.remoteAddress;
	const clientIndex = clients.findIndex(client => client.ip == ws.ip) 
	if(clientIndex != -1)
	{
		console.log("was client with same ip")
		clients.splice(clientIndex, 1)
		clients.push(ws);
	}
	else{
		clients.push(ws);
	}
	console.log("clients" + clients.length)
	ws.on('message', async(message) => {
		console.log("clients" + clients.length)
		const json = JSON.parse(message);
		switch(json.event) {
			case "connect": 
			{
				const game = await Game.findByPk(json.id);
				switch(game.numberOfPlayers) {
					case 0:
						game.player1 = ws.ip;
						game.numberOfPlayers = 1;
						game.save();
						ws.send(JSON.stringify({event: "connected", isX: true}))
					break;
					
					case 1:
						game.player2 = ws.ip;
						game.numberOfPlayers = 2;
						game.save();
						ws.send(JSON.stringify({event: "connected", isX: false}))
						const player1 = clients.find(client => client.ip == game.player1);
						const player2 = clients.find(client => client.ip == game.player2);
						player1.send(JSON.stringify({event: "start"}));
						player2.send(JSON.stringify({event: "start"}));
					break;
					
					default:
						ws.send("bad request");
				}
				break;
			}
				
			case "move":
			{
				const game = await Game.findByPk(json.id);
				if(game.player1 == ws.ip) {
					const player2 = clients.find(client => client.ip == game.player2);
					player2.send(message);
				}
				if(game.player2 == ws.ip) {
					const player1 = clients.find(client => client.ip == game.player1);
					player1.send(message);
				}
				break;
			}
			
			case "finish":
			{
				const game = await Game.findByPk(json.id);
				if(game){
					await game.destroy();
				}
				break;
			}
				
			default: 
				ws.send((new Error("Wrong query")).message);
		}
	})
	ws.on('error', (error) => {
		console.log('error');
	});
	ws.on('close', (event) => {
		if(event.wasClean){
			console.log("Closed clean");
		}
		else {
			console.log("Closed bad");
			console.log(event.code);
		}
	});
});

sequelize.sync({force: false}).then(result=>{
	console.log("OK");
	server.listen(process.env.PORT,()=>{
		console.log('Server is up and running at the port ' + process.env.PORT)
	});
	
}).catch(err=> console.log(err));