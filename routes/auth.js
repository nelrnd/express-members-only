const express = require("express")
const Router = express.Router()
const authController = require("../controllers/authController")

Router.get("/sign-up", authController.ensure_not_logged_in, authController.sign_up_get)

Router.post("/sign-up", authController.sign_up_post, authController.log_in_post)

Router.get("/log-in", authController.ensure_not_logged_in, authController.log_in_get)

Router.post("/log-in", authController.log_in_post)

Router.get("/log-out", authController.log_out_get)

module.exports = Router
