const express = require("express")
const Router = express.Router()
const postController = require("../controllers/postController")
const authController = require("../controllers/authController")
const userController = require("../controllers/userController")

Router.get("/create", authController.ensure_logged_in, postController.post_create_get)

Router.post("/create", authController.ensure_logged_in, postController.post_create_post)

Router.get(
  "/:id/delete",
  authController.ensure_logged_in,
  userController.ensure_admin,
  postController.post_delete_get
)

Router.post(
  "/:id/delete",
  authController.ensure_logged_in,
  userController.ensure_admin,
  postController.post_delete_post
)

module.exports = Router
