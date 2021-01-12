const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

// Role data model
const GameRoles = sequelize.define('GameRoles', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	emoji: Sequelize.STRING,
});
module.exports = { GameRoles }
