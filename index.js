const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

const connection = require("./database/database");

//models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

//view engine
app.set('view engine', 'ejs');

app.use(session({
    secret: "manigold",
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true
}))

//Static
app.use(express.static('public'));

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//controllers 
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/usersController");

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

//Database
connection
    .authenticate()
    .then(() => {
        console.log("conectado ao banco de dados!");
    }).catch((error) => {
        console.log(error);
    });

    
app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 5
    }).then( articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        })
    });
});

app.get('/:slug', (req, res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then( article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            })
        }else {
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){

            console.log(Category);

            Category.findAll().then(categories => {
               res.render("index", {articles: category.articles, categories: categories});
            })
        }else {
            res.redirect("/");
        }
    }).catch( err => { 
        res.redirect("/");
    });
});

app.listen(8080, () => {
    console.log("Servidor iniciado!");
});
