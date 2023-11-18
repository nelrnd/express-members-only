require("dotenv").config()
const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const User = require("./models/User")

// Define and configure app

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

// Setup express-session and passport

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username })
      if (!user) {
        return done(null, false, { message: "Invalid email" })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return done(null, false, { message: "Invalid password" })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

// Connect to database

const mongoDB = process.env.MONGODB_URI
const main = async () => mongoose.connect(mongoDB)
main().catch((err) => console.error(err))

// Handle routes

const authRouter = require("./routes/auth")
const authController = require("./controllers/authController")

app.use(authRouter)

app.get("/", authController.ensure_logged_in, (req, res) => res.render("index"))

app.listen(3000)
