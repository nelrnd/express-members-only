const express = require("express")
const Router = express.Router()
const authController = require("../controllers/authController")

Router.get("/sign-up", authController.auth_controller_sign_up_get)

Router.post("/sign-up", authController.auth_controller_sign_up_post)

Router.get("/log-in", authController.auth_controller_log_in_get)

Router.post("/log-in", authController.auth_controller_log_in_post)

Router.get("/log-out", authController.auth_controller_log_out_get)

module.exports = Router
