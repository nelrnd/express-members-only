const User = require("../models/User")
const passport = require("passport")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")

exports.auth_controller_sign_up_get = (req, res, next) => {
  res.render("sign-up-form")
}

exports.auth_controller_sign_up_post = asyncHandler(async (req, res, next) => {
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

exports.auth_controller_log_in_get = (req, res, next) => {
  res.render("log-in-form")
}

exports.auth_controller_log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
})

exports.auth_controller_log_out_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect("/log-in")
  })
}
