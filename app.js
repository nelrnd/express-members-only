require("dotenv").config()
const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const User = require("./models/User")

// Define and configure app

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Connect to database

const mongoDB = process.env.MONGODB_URI
const main = async () => mongoose.connect(mongoDB)
main().catch((err) => console.error(err))

app.get("/", (req, res) => res.render("index"))

app.get("/sign-up", (req, res) => res.render("sign-up-form"))

app.listen(3000)
