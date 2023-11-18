const User = require("../models/User")
const passport = require("passport")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")

exports.sign_up_get = (req, res, next) => {
  res.render("sign-up-form")
}

exports.sign_up_post = asyncHandler(async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10)
  const user = new User({
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: hash,
    membership_status: "outsider",
  })
  user.save()
  res.redirect("/")
})

exports.log_in_get = (req, res, next) => {
  res.render("log-in-form", {
    user_email: process.env.USER_EMAIL,
    user_password: process.env.USER_PASSWORD,
  })
}

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
})

exports.log_out_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect("/log-in")
  })
}

exports.ensure_logged_in = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect("/log-in")
  }
}

exports.ensure_not_logged_in = (req, res, next) => {
  if (!req.user) {
    next()
  } else {
    res.redirect("/")
  }
}
