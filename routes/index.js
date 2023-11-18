const express = require("express")
const Router = express.Router()
const postController = require("../controllers/postController")
const authController = require("../controllers/authController")

Router.get("/", authController.ensure_logged_in, postController.post_list)

module.exports = Router
