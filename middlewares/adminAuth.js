function adminAuth(req, res, next){
    if(req.session.user != undefined){
        console.log(req.session.user);
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = adminAuth;