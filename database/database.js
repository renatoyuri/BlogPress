const Sequelize = require("sequelize");

const connection = new Sequelize('blogpress', 'root', 'sudoku00', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00',
    logging: false
});

module.exports = connection;