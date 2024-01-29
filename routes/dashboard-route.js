var express = require('express');
// var auth = require('auth'); 
var router = express.Router();
/* GET users listing. */
router.get('/dashboard',  function(req, res, next) {
    // res.render('dashboard.ejs',{email:req.session.Email})
    if(req.session.loggedinUser){
        res.render('dashboard.ejs',{email:req.session.Email})
    }else{
        res.redirect('/login');
    }
});
module.exports = router;