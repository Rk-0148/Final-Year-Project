var express = require("express");

var router = express.Router();
var db = require("../database");
var app = express();
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.render("login-form.ejs");
});

router.post("/login", function (req, res) {
  var Email = req.body.email_address;
  var Password = req.body.password;

  var sql = "SELECT * FROM registered_users WHERE Email =? AND password =?";
  db.query(sql, [Email, Password], function (err, data, fields) {
    if (err) throw err;
    if (data.length > 0) {
      req.session.loggedinUser = true;
      req.session.Email = Email;
      res.redirect("/userInfo");
      // res.redirect('/blockchain');
    } else {
      res.render("login-form.ejs", {
        alertMsg: "Your Email Address or password is wrong",
      });
    }
  });
});

module.exports = router;
