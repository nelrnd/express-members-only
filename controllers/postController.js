const Post = require("../models/Post")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.post_list = asyncHandler(async (req, res, next) => {
  let allPosts = await Post.find().populate("user").sort({ timestamp: -1 }).exec()

  if (req.user.membership_status !== "member") {
    allPosts.forEach((post) => {
      if (post.user._id.toString() !== req.user._id.toString()) {
        post.user = null
      }
    })
  }

  res.render("post-list", { title: "Home", post_list: allPosts })
})

exports.post_create_get = (req, res, next) => {
  res.render("post-form", { title: "Create post" })
}

exports.post_create_post = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters")
    .escape(),
  body("text")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters")
    .escape(),
  // Transform text string into array of paragraphs
  (req, res, next) => {
    const text = req.body.text.replaceAll("\r\n\r\n", "\r\n").split("\r\n")
    res.locals.text = text
    next()
  },
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const post = new Post({
      title: req.body.title,
      text: res.locals.text,
      user: req.user.id,
    })

    if (!errors.isEmpty()) {
      post.text = req.body.text
      return res.render("post-form", { title: "Create post", post: post, errors: errors.array() })
    }

    await post.save()
    res.redirect("/")
  }),
]
