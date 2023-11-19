const express = require("express")
const Router = express.Router()
const postController = require("../controllers/postController")
const authController = require("../controllers/authController")
const userController = require("../controllers/userController")

Router.get("/", authController.ensure_logged_in, postController.post_list)

Router.get(
  "/join-club",
  authController.ensure_logged_in,
  userController.ensure_not_in_club,
  userController.join_club_get
)

Router.post(
  "/join-club",
  authController.ensure_logged_in,
  userController.ensure_not_in_club,
  userController.join_club_post
)

module.exports = Router
