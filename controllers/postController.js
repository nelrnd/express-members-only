const Post = require("../models/Post")
const asyncHandler = require("express-async-handler")

exports.post_create_get = (req, res, next) => {
  res.render("post-form")
}

exports.post_create_post = asyncHandler(async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    user: req.user.id,
  })
  await post.save()
  res.redirect(post.url)
})
