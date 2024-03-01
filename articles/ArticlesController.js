const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles});
    });
    
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});
    })
});

router.post("/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title, {remove: /[*+~.()'"!:@]/g}),
        body: body,
        categoryId: categoryId
    }).then(()=>{
        res.redirect("/admin/articles")
    });
});

router.post("/articles/delete", (req, res) => {
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }else {
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    } 
});

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id;
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article});
            });
        }else{
            res.redirect("/");
        } 
    }).catch( err => {
        res.redirect("/");
    });
});

router.post("/articles/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.update({
        title: title,
        body: body,
        categoryId: category,
        slug: slugify(title, {remove: /[*+~.()'"!:@]/g})},
        {
            where: {
                id: id
            } 
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch(err => {
            res.redirect("/");
        });
});

router.get("/articles/page/:num", (req, res) => {
    const page = parseInt(req.params.num) || 1; // Página atual, padrão é 1
    const limit = 5; // Número de itens por página
    const offset = (page - 1) * limit; // Cálculo do offset
    let nextPage;

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]        
    }).then(articles => {
        //const articles = result.rows;
        //const count = result.count;

        if(offset + limit >= articles.count){
            nextPage = false;
        } else {
            nextPage = true;
        } 

        let result = {
            nextPage: nextPage,
            articles: articles,
            page: page
        };

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        });
      
        //const formattedJSON = JSON.stringify({ articles, count, nextPage }, null, 3);
        //res.setHeader('Content-Type', 'application/json');
        //res.end(formattedJSON);
    })
});

module.exports = router;