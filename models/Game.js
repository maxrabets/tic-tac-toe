const Sequelize = require("sequelize");
const sequelize = require("../sequelize");

Game = sequelize.define("game", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tags: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  player1: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  player2: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  numberOfPlayers: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
});

module.exports = Game