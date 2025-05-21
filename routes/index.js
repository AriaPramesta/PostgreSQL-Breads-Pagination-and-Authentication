var express = require("express");
const { generatePassword, comparePassword } = require("../helper/util");
var router = express.Router();

module.exports = function (db) {
  router.get("/", function (req, res, next) {
    res.render("login", { errorMessage: req.flash('errorMessage') });
  });

  router.post('/login', function (req, res) {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = $1", [email]).then((data) => {
      console.log(data);
      if (data.rows.length == 0) {
        req.flash('errorMessage', "Email doesn't exist")
        res.redirect("/")
      } else {
        if (comparePassword(password, data.rows[0].password)) {
          req.session.user = data.rows[0]
          res.redirect("/todos");
        } else {
          req.flash('errorMessage', 'Wrong Email or Password!')
          res.redirect("/")
        }
      }
    }).catch((e) => {
      console.log(e);
      res.redirect("/");
    });
  });


  router.get("/register", function (req, res, next) {
    res.render("register", { errorMessage: req.flash('errorMessage') });
  });

  router.post("/register", function (req, res) {
    const { email, password, repassword } = req.body;

    if (password !== repassword) {
      req.flash('errorMessage', "Password doesn't match")
      return res.redirect("/register")
    }

    db.query("SELECT * FROM users WHERE email = $1", [email]).then((data) => {
      console.log(data);
      if (data.rows.length > 0) {
        req.flash('errorMessage', 'Email already exist')
        res.redirect("/register")
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

  router.get("/users/avatar", function (req, res, next) {
    res.render("avatar");
  });

  return router;
};
