var express = require("express");
var router = express.Router();
var conn = require("../database");
var getAge = require("get-age");
var nodemailer = require("nodemailer");

var rand = Math.floor(Math.random() * 10000 + 54);
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aakashkanchan2692@gmail.com",
    pass: "eqrn warn kesu fmnb",
  },
});
// Function to convert 'DD-MM-YYYY' to 'YYYY-MM-DD'
function convertToYYYYMMDD(dateString) {
  var parts = dateString.split("-");
  if (parts.length === 3) {
    return parts[2] + "-" + parts[1] + "-" + parts[0];
  } else {
    console.error("Invalid date format:", dateString);
    return null; // or handle the error in an appropriate way
  }
}
var account_address;
var data;

router.get("/form", function (req, res, next) {
  if (req.session.loggedinUser) {
    res.render("voter-registration.ejs");
  } else {
    res.redirect("/login");
  }
});

router.post("/registerdata", function (req, res) {
  var dob = req.body.dob; // Assuming the form field name is 'dob'
  data = req.body.aadharno; // data stores aadhar no
  console.log(data);
  account_address = req.body.account_address; // stores metamask acc address
  console.log(account_address);
  var age;
  // Convert the 'dob' to 'YYYY-MM-DD' format before using it in the database query
  var formattedDob = convertToYYYYMMDD(dob);

  let sqlSelect = "SELECT * FROM registered_users WHERE Aadharno = ?";

  conn.query(sqlSelect, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    // Check if results array is not empty
    if (results.length > 0) {
      var email = results[0].Email;
      age = getAge(formattedDob);
      is_registered = results[0].Is_registered;

      if (is_registered != "YES") {
        if (age >= 18) {
          var mailOptions = {
            from: "rohankadam1602@gmail.com",
            to: email,
            subject: "Please confirm your Email account",
            text: "Hello, Your otp is " + rand,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          res.render("emailverify.ejs");
        } else {
          res.send("You cannot vote as your age is less than 18");
        }
      } else {
        res.render("voter-registration.ejs", {
          alertMsg: "You are already registered. You cannot register again",
        });
      }

      console.log(formattedDob);
      console.log(age);
    } else {
      console.log("No matching record found");
    }
  });

  // update database

  // SQL query to update dob and account_address
  let sqlUpdate = "UPDATE registered_users SET dob = ? WHERE Aadharno = ?";

  conn.query(
    sqlUpdate,
    [dob, data],
    (updateError, updateResults, updateFields) => {
      if (updateError) {
        console.error(updateError.message);
        // Handle the error as needed
      } else {
        console.log("Record updated successfully");
        // Handle the success as needed
      }
    }
  );
});
///////////////////////////////////////////

router.post("/otpverify", (req, res) => {
  var otp = req.body.otp;
  if (otp == rand) {
    var record = { Account_address: account_address, Is_registered: "Yes" };
    var sql = "UPDATE registered_users SET ? ";
    conn.query(sql, record, function (err2, res2) {
      if (err2) {
        throw err2;
      } else {
        var sql1 =
          "Update registered_users set Is_registered=? Where Aadharno=?";
        var record1 = ["YES", data];
        console.log(data);
        conn.query(sql1, record1, function (err1, res1) {
          if (err1) {
            res.render("voter-registration.ejs");
          } else {
            console.log("1 record updated");
            var msg = "You are successfully registered";
            res.render("voter-registration.ejs", { alertMsg: msg });
          }
        });
      }
    });
  } else {
    res.render("voter-registration.ejs", {
      alertMsg: "Session Expired! , You have entered wronge OTP ",
    });
  }
});

module.exports = router;
