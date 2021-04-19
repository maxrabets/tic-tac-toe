const express = require("express");
const findController = require("../controllers/findController.js");
const findRouter = express.Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
 
findRouter.get('/getGames', findController.getGames);
findRouter.patch('/connectToTheGame', jsonParser, findController.connectToTheGame);

module.exports = findRouter;