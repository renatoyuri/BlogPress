const sequelize = require("sequelize");
const connection = require("../database/database");

const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title:{
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    body: {
        type: sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); //Uma categoria tem muitos artigos. 
Article.belongsTo(Category); //Um artigo tem uma categoria.

//Article.sync({force: true});


module.exports = Article;