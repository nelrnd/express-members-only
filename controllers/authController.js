const User = require("../models/User")
const passport = require("passport")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.sign_up_get = (req, res, next) => {
  res.render("sign-up-form", { title: "Sign up" })
}

exports.sign_up_post = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format is invalid")
    .custom(async (value) => {
      const user = await User.exists({ email: value })
      if (user !== null) {
        return Promise.reject()
      }
    })
    .withMessage("Email is already taken")
    .escape(),
  body("first_name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters")
    .isAlpha()
    .withMessage("First name must only contain letters")
    .escape(),
  body("last_name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters")
    .isAlpha()
    .withMessage("Last name must only contain letters")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password
    })
    .withMessage("Password confirmation does not match the entered password"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const hash = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hash,
      membership_status: "outsider",
    })

    if (!errors.isEmpty()) {
      user.password = req.body.password
      user.confirm_password = req.body.confirm_password
      return res.render("sign-up-form", {
        title: "Sign up",
        user: user,
        errors: errors.array({ onlyFirstError: true }),
      })
    }

    await user.save()
    next()
  }),
]

exports.log_in_get = (req, res, next) => {
  const errors = []
  if (req.session.messages) {
    errors.push({ msg: req.session.messages.pop() })
    req.session.messages = undefined
  }
  res.render("log-in-form", {
    title: "Log in",
    errors: errors,
    user: { email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD },
  })
}

exports.log_in_post = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format is invalid"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const user = {
        email: req.body.email,
        password: req.body.password,
      }
      return res.render("log-in-form", {
        title: "Log in",
        user: user,
        errors: errors.array({ onlyFirstError: true }),
      })
    }

    next()
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: "Invalid email or password",
  }),
]

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
