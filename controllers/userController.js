const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")

exports.join_club_get = (req, res, next) => {
  res.render("join-club-form", { title: "Join the club" })
}

exports.join_club_post = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Passcode is required")
    .custom((value) => value === process.env.SECRET_PASSCODE)
    .withMessage("Invalid passcode"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.render("join-club-form", {
        title: "Join the club",
        errors: errors.array({ onlyFirstError: true }),
      })
    }

    // update user membership status
    await User.findByIdAndUpdate(req.user.id, { $set: { membership_status: "member" } })
    res.redirect("/")
  }),
]

exports.ensure_not_in_club = (req, res, next) => {
  if (req.user.membership_status !== "member") {
    next()
  } else {
    res.redirect("/")
  }
}
