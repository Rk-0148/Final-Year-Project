var express = require("express");
var router = express.Router();
var db = require("../database");
var app = express();
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

// to display registration form
router.get("/register", function (req, res, next) {
  res.render("registration-form.ejs");
});

// to store user input detail on post request
router.post("/register", function (req, res, next) {
  inputData = {
    FirstName: req.body.first_name,
    LastName: req.body.last_name,
    Email: req.body.email_address,
    Gender: req.body.gender,
    Contact: req.body.contact,
    Aadharno: req.body.Aadharno,
    Password: req.body.password,
    ConfirmPassword: req.body.confirm_password,
  };

  // check unique email address

  var sql = "SELECT * FROM registered_users WHERE Email =?";
  db.query(sql, [inputData.email_address], function (err, data, fields) {
    if (err) throw err;
    if (data.length > 1) {
      var msg = inputData.email_address + "was already exist";
    } else if (inputData.confirm_password != inputData.password) {
      var msg = "Password & Confirm Password is not Matched";
    } else {
      // save users data into database
      var sql = "INSERT INTO registered_users SET ?";
      console.log(sql);
      db.query(sql, inputData, function (err, data) {
        if (err) throw err;
      });
      var msg = "Your are successfully registered";
    }
    res.render("registration-form.ejs", { alertMsg: msg });
  });
});
module.exports = router;
