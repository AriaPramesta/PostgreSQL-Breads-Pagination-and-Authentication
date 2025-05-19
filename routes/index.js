var express = require("express");
const { generatePassword, comparePassword } = require("../helper/util");
var router = express.Router();

module.exports = function (db) {
  router.get("/", function (req, res, next) {
    res.render("login");
  });

  router.post('/login', function (req, res) {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = $1", [email]).then((data) => {
      console.log(data);
      if (data.rows.length == 0) {
        res.send("email doesn't exist");
      } else {
        if (comparePassword(password, data.rows[0].password)) {
          req.session.user = data.rows[0]
          res.redirect("/todos");
        } else {
          res.send('wrong email or password')
        }
      }
    }).catch((e) => {
      console.log(e);
      res.redirect("/");
    });
  });


  router.get("/register", function (req, res, next) {
    res.render("register");
  });

  router.post("/register", function (req, res) {
    const { email, password, repassword } = req.body;

    if (password !== repassword) return res.send("password doesn't match");

    db.query("SELECT * FROM users WHERE email = $1", [email]).then((data) => {
      console.log(data);
      if (data.rows.length > 0) {
        res.send("email already exist");
      } else {
        db.query("INSERT INTO users (email, password) VALUES ($1, $2) returning *", [
          email,
          generatePassword(password),
        ]).then((user) => {
          req.session.user = user.rows[0]
          res.redirect("/todos");
        }).catch((e) => {
          console.log(e);
          res.redirect("/");
        });
      }
    }).catch((err) => {
      res.send(err);
    });
  });

  router.get('/logout', function (req, res) {
    req.session.destroy(function () {
      res.redirect('/')
    })
  })

  return router;
};
