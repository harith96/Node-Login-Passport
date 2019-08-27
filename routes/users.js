const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const {
  checkRequiredFields,
  checkPasswordsMatch,
  checkPasswordLength
} = require("../middleware/register");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  checkRequiredFields,
  checkPasswordsMatch,
  checkPasswordLength,
  (req, res) => {
    const { name, email, password } = req.body;
    if (req.errors.length > 0) {
      req.errors.forEach(element => {
        console.log(element.msg);
      });
      res.render("register", {
        errors: req.errors,
        name,
        email,
        password
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          return res.render("register", {
            errors: [{ msg: "User is already registered" }]
          });
        } else {
          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password
          });
          bcrypt.hash(newUser.password, 10, (err, hash) => {
            if (err) {
              console.log(err);
              return;
            }
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                console.log(newUser);
                req.flash("success_msg", "You are now registered. Log In");
                return res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
              });
          });
        }
      });
    }
  }
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are successfully logged out.");
  res.redirect("/users/login");
});

module.exports = router;
