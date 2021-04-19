const express = require("express");
const createController = require("../controllers/createController.js");
const createRouter = express.Router();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
 
createRouter.post('/createGame', jsonParser, createController.createGame);
 
module.exports = createRouter;